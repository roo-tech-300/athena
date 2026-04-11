import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as sdk from 'node-appwrite';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const paystackSignature = req.headers['x-paystack-signature'] as string;
    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!secret) {
        console.error('PAYSTACK_SECRET_KEY is not configured');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    // 1. Verify Paystack Signature
    const hash = crypto
        .createHmac('sha512', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (hash !== paystackSignature) {
        console.warn('Unauthorized request: Signature mismatch');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const event = req.body;
    console.log(`Received Paystack Event: ${event.event}`);

    // 2. Initialize Appwrite SDK (Server-side)
    const client = new sdk.Client();
    const database = new sdk.Databases(client);

    const endpoint = process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
    const projectId = process.env.VITE_APPWRITE_PROJECT_ID;
    const apiKey = process.env.APPWRITE_API_KEY; // MUST be set in Vercel Dashboard

    if (!projectId || !apiKey) {
        console.error('Appwrite Project ID or API Key is not configured');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    client
        .setEndpoint(endpoint)
        .setProject(projectId)
        .setKey(apiKey);

    const databaseId = process.env.VITE_APPWRITE_DATABASE_ID;
    const departmentCollectionId = process.env.VITE_APPWRITE_DEPARTMENT_ID;

    if (!databaseId || !departmentCollectionId) {
        console.error('Appwrite Database ID or Collection ID is not configured');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        // 3. Extract Department ID from metadata
        const departmentId = event.data?.metadata?.departmentId;

        if (!departmentId) {
            console.warn('No departmentId found in metadata. Skipping update.');
            return res.status(200).json({ message: 'Accepted - No ID' });
        }

        // 4. Handle specific events
        switch (event.event) {
            case 'charge.success':
            case 'subscription.create':
                // Payment was successful - Activate subscription
                await database.updateDocument(databaseId, departmentCollectionId, departmentId, {
                    subscriptionStatus: 'Active',
                    plan: 'Standard'
                });
                console.log(`Successfully activated department: ${departmentId}`);
                break;

            case 'subscription.disable':
            case 'invoice.payment_failed':
                // Cancellation or payment failure - Deactivate subscription
                await database.updateDocument(databaseId, departmentCollectionId, departmentId, {
                    subscriptionStatus: 'Inactive'
                });
                console.log(`Deactivated department: ${departmentId}`);
                break;

            default:
                console.log(`Ignored event type: ${event.event}`);
        }

        return res.status(200).json({ message: 'Success' });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error(`Webhook Processing Error: ${message}`);
        return res.status(500).json({ message: 'Internal Server Error', error: message });
    }
}
