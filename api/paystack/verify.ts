import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as sdk from 'node-appwrite';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const reference = (req.query?.reference as string | undefined) ?? '';
        if (!reference) {
            return res.status(400).json({ error: 'Missing required query param: reference' });
        }

        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!secretKey) {
            return res.status(500).json({ error: 'PAYSTACK_SECRET_KEY is not configured' });
        }

        const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({ error: data?.message ?? 'Paystack verify failed', details: data });
        }

        const transactionData = data.data;

        // Perform Server-Side DB Update if status is success
        if (transactionData.status === 'success') {
            const departmentId = transactionData.metadata?.departmentId;

            if (departmentId) {
                const client = new sdk.Client();
                const databases = new sdk.Databases(client);

                const endpoint = process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
                const projectId = process.env.VITE_APPWRITE_PROJECT_ID;
                const apiKey = process.env.APPWRITE_API_KEY; // Must be set in Vercel

                if (projectId && apiKey) {
                    client.setEndpoint(endpoint).setProject(projectId).setKey(apiKey);

                    const dbId = process.env.VITE_APPWRITE_DATABASE_ID;
                    const collId = process.env.VITE_APPWRITE_DEPARTMENT_ID;

                    if (dbId && collId) {
                        await databases.updateDocument(dbId, collId, departmentId, {
                            subscriptionStatus: 'Active',
                            plan: 'Standard'
                        });
                        console.log(`Verified & Updated department: ${departmentId}`);
                    }
                }
            }
        }

        return res.status(200).json(transactionData);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error(`Verification error: ${message}`);
        return res.status(500).json({ error: message });
    }
}
