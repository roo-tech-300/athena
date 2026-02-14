export const SUBSCRIPTION_PLANS = [
    {
        id: 'standard',
        name: 'Standard Plan',
        price: 15000,
        currency: '₦',
        interval: 'monthly',
        grantLimit: 5,
        features: [
            'Up to 5 Active Grants',
            'Full Institutional Governance',
            'Priority Support',
            'Advanced Financial Reporting',
            'Multiple Group Members'
        ],
        paystackPlanCode: import.meta.env.VITE_PAYSTACK_PLAN_ID_STANDARD
    }
];
