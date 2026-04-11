import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Initializes a subscription transaction.
 * Usually, you'd do this and redirect the user to the `authorization_url`.
 */
export const initializeSubscription = async (email: string, planCode: string, departmentId?: string) => {
    try {
        const response = await api.post('/paystack/init', {
            email,
            planCode,
            departmentId,
        });
        return response.data; // Includes authorization_url and reference
    } catch (error: unknown) {
        const err = error as { response?: { data?: unknown }; message?: string };
        console.error('Paystack Initialization Error:', err.response?.data || err.message || error);
        throw error;
    }
};

/**
 * Verifies a transaction status.
 */
export const verifyTransaction = async (reference: string) => {
    try {
        const response = await api.get('/paystack/verify', {
            params: { reference },
        });
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: unknown }; message?: string };
        console.error('Paystack Verification Error:', err.response?.data || err.message || error);
        throw error;
    }
};

/**
 * Cancels a subscription.
 */
export const cancelSubscription = async (subscriptionCode: string, emailToken: string) => {
    try {
        const response = await api.post('/paystack/cancel', {
            subscriptionCode,
            emailToken,
        });
        return response.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: unknown }; message?: string };
        console.error('Paystack Cancellation Error:', err.response?.data || err.message || error);
        throw error;
    }
};
