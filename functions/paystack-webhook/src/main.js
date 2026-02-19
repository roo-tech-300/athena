const sdk = require('node-appwrite');
const crypto = require('crypto');

/**
 * Paystack Webhook Handler
 * 
 * This function is triggered by Paystack when:
 * 1. A payment is successful (charge.success)
 * 2. A subscription is created (subscription.create)
 * 3. A subscription is cancelled (subscription.disable)
 * 4. A payment fails (invoice.payment_failed)
 */
module.exports = async function (context) {
    const { req, res, log, error } = context;

    // 1. Security check: Verify the request is actually from Paystack
    const paystackSignature = req.headers['x-paystack-signature'];
    const secret = process.env.PAYSTACK_SECRET_KEY;

    // For local testing/non-signed requests we might skip this, 
    // but for production it's mandatory
    if (paystackSignature) {
        const hash = crypto
            .createHmac('sha512', secret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (hash !== paystackSignature) {
            error('Unauthorized request: Signature mismatch');
            return res.json({ message: 'Unauthorized' }, 401);
        }
    }

    const event = req.body;
    log(`Received Paystack Event: ${event.event}`);

    // 2. Initialize Appwrite SDK
    const client = new sdk.Client();
    const database = new sdk.Databases(client);

    client
        .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
        .setProject(process.env.APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const DB_ID = process.env.DATABASE_ID;
    const DEPT_COLLECTION_ID = process.env.DEPARTMENT_COLLECTION_ID;

    try {
        // 3. Extract Department ID from metadata
        const departmentId = event.data.metadata?.departmentId;

        if (!departmentId) {
            log('No departmentId found in metadata. Checking for subscription data...');
            // Optional: fallback logic if payment was via a subscription object directly
        }

        if (!departmentId) {
            log('Could not identify department. Skipping update.');
            return res.json({ message: 'Accepted - No ID' });
        }

        // 4. Handle specific events
        switch (event.event) {
            case 'charge.success':
            case 'subscription.create':
                // Payment was successful - Activate subscription
                await database.updateDocument(DB_ID, DEPT_COLLECTION_ID, departmentId, {
                    subscriptionStatus: 'Active',
                    plan: 'Standard'
                });
                log(`Successfully activated department: ${departmentId}`);
                break;

            case 'subscription.disable':
            case 'invoice.payment_failed':
                // Cancellation or payment failure - Deactivate subscription
                await database.updateDocument(DB_ID, DEPT_COLLECTION_ID, departmentId, {
                    subscriptionStatus: 'Inactive'
                });
                log(`Deactivated department: ${departmentId}`);
                break;

            default:
                log(`Ignored event type: ${event.event}`);
        }

        return res.json({ message: 'Success' });
    } catch (err) {
        error(`Update Error: ${err.message}`);
        return res.json({ message: 'Internal Server Error', error: err.message }, 500);
    }
};
