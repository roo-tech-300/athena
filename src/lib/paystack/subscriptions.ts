import axios from 'axios';

const PAYSTACK_SECRET_KEY = import.meta.env.VITE_PAYSTACK_SECRET_KEY;
const API_URL = 'https://api.paystack.co';

export const paystack = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
    },
});

/**
 * Initializes a subscription transaction.
 * Usually, you'd do this and redirect the user to the `authorization_url`.
 */
export const initializeSubscription = async (email: string, planCode: string, departmentId?: string) => {
    try {
        const callbackUrl = departmentId
            ? `${window.location.origin}/department/${departmentId}`
            : `${window.location.origin}/portal`;

        const response = await paystack.post('/transaction/initialize', {
            email,
            amount: 15000, // This is overridden by the plan amount if the plan is set correctly
            plan: planCode,
            callback_url: callbackUrl, // Redirect back after payment
            metadata: {
                departmentId: departmentId,
            },
        });
        return response.data.data; // Includes authorization_url and reference
    } catch (error: any) {
        console.error('Paystack Initialization Error:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Verifies a transaction status.
 */
export const verifyTransaction = async (reference: string) => {
    try {
        const response = await paystack.get(`/transaction/verify/${reference}`);
        return response.data.data;
    } catch (error: any) {
        console.error('Paystack Verification Error:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * Cancels a subscription.
 */
export const cancelSubscription = async (subscriptionCode: string, emailToken: string) => {
    try {
        const response = await paystack.post('/subscription/disable', {
            code: subscriptionCode,
            token: emailToken
        });
        return response.data;
    } catch (error: any) {
        console.error('Paystack Cancellation Error:', error.response?.data || error.message);
        throw error;
    }
};
