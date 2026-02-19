# Paystack Webhook Setup Guide

To implement **Option 1 (Automatic Updates)** and **Option 2 (Cancellation Handling)**, you need a backend "listener" that stays online even when the user closes their browser. Since you are using Appwrite, the best way to do this is with an **Appwrite Function**.

## Step 1: Create the Appwrite Function

1.  Go to your **Appwrite Console**.
2.  Navigate to **Functions** > **Create Function**.
3.  Choose **Node.js** as the runtime.
4.  Give it a name like `paystack-webhook-handler`.

## Step 2: The Code

Copy and paste this logic into your function's `index.js`. This code listens for Paystack events and updates your database automatically.   

```javascript
const sdk = require('node-appwrite');
const crypto = require('crypto');

module.exports = async function (context) {
    const { req, res, log, error } = context;

    // 1. Security check: Verify the request is actually from Paystack
    const paystackSignature = req.headers['x-paystack-signature'];
    const secret = process.env.PAYSTACK_SECRET_KEY;
    
    const hash = crypto
        .createHmac('sha512', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (hash !== paystackSignature) {
        error('Unauthorized request');
        return res.json({ message: 'Unauthorized' }, 401);
    }

    const event = req.body;
    log(`Received Paystack Event: ${event.event}`);

    // 2. Initialize Appwrite SDK
    const client = new sdk.Client();
    const database = new sdk.Databases(client);

    client
        .setEndpoint(process.env.APPWRITE_ENDPOINT)
        .setProject(process.env.APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY); // Must have "documents.write" permission

    const DB_ID = process.env.DATABASE_ID;
    const DEPT_COLLECTION_ID = process.env.DEPARTMENT_COLLECTION_ID;

    try {
        // 3. Extract Department ID from metadata we added in the frontend
        const departmentId = event.data.metadata?.departmentId;

        if (!departmentId) {
            log('No departmentId found in metadata. Skipping.');
            return res.json({ message: 'Accepted' });
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
                log(`Activated department: ${departmentId}`);
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
                log(`Ignored event: ${event.event}`);
        }

        return res.json({ message: 'Success' });
    } catch (err) {
        error(`Update Error: ${err.message}`);
        return res.json({ message: 'Internal Server Error' }, 500);
    }
};
```

## Step 3: Environment Variables

In your Appwrite Function settings, add these variables:
*   `PAYSTACK_SECRET_KEY`: Your Paystack Secret Key (from Paystack Dashboard).
*   `APPWRITE_API_KEY`: An API Key from Appwrite with `documents.write` scope.
*   `DATABASE_ID`: Your Appwrite Database ID.
*   `DEPARTMENT_COLLECTION_ID`: Your Departments Collection ID.

## Step 4: Configure Paystack Dashboard

1.  Copy the **Execution URL** of your new Appwrite Function.
2.  Log in to your **Paystack Dashboard**.
3.  Go to **Settings** > **API Keys & Webhooks**.
4.  Paste the URL into the **Webhook URL** field.
5.  Click **Save**.

Now, whenever a payment occurs or a subscription is canceled, Paystack will ping your function, and your database will update itself instantly—no matter if the user's browser is open or not!
