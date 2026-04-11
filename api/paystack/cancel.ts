import type { VercelRequest, VercelResponse } from '@vercel/node';

function parseJsonBody<T>(req: VercelRequest): T | null {
    if (typeof req.body === 'string') {
        try {
            return JSON.parse(req.body) as T;
        } catch {
            return null;
        }
    }

    return (req.body ?? null) as T | null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const body = parseJsonBody<{ subscriptionCode?: string; emailToken?: string }>(req);
        if (!body) return res.status(400).json({ error: 'Invalid JSON body' });

        const { subscriptionCode, emailToken } = body;
        if (!subscriptionCode || !emailToken) {
            return res.status(400).json({ error: 'Missing required fields: subscriptionCode, emailToken' });
        }

        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!secretKey) {
            return res.status(500).json({ error: 'PAYSTACK_SECRET_KEY is not configured' });
        }

        const response = await fetch('https://api.paystack.co/subscription/disable', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: subscriptionCode,
                token: emailToken,
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({ error: data?.message ?? 'Paystack cancel failed', details: data });
        }

        return res.status(200).json(data);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return res.status(500).json({ error: message });
    }
}
