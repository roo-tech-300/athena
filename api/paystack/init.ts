import type { VercelRequest, VercelResponse } from '@vercel/node';

function getAppUrl(req: VercelRequest) {
    const configured = process.env.APP_URL;
    if (configured) return configured.replace(/\/$/, '');

    const protoHeader = (req.headers['x-forwarded-proto'] ?? req.headers['X-Forwarded-Proto']) as string | undefined;
    const proto = (protoHeader ?? 'https').split(',')[0].trim();

    const hostHeader = (req.headers['x-forwarded-host'] ?? req.headers['host'] ?? req.headers['Host']) as string | undefined;
    const host = (hostHeader ?? '').split(',')[0].trim();

    if (!host) return '';
    return `${proto}://${host}`;
}

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

        const body = parseJsonBody<{ email?: string; planCode?: string; departmentId?: string }>(req);
        if (!body) return res.status(400).json({ error: 'Invalid JSON body' });

        const { email, planCode, departmentId } = body;
        if (!email || !planCode) {
            return res.status(400).json({ error: 'Missing required fields: email, planCode' });
        }

        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!secretKey) {
            return res.status(500).json({ error: 'PAYSTACK_SECRET_KEY is not configured' });
        }

        const appUrl = getAppUrl(req);
        if (!appUrl) {
            return res.status(500).json({ error: 'APP_URL is not configured' });
        }
        const callbackUrl = departmentId ? `${appUrl}/department/${departmentId}` : `${appUrl}/portal`;

        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                plan: planCode,
                metadata: {
                    departmentId,
                },
                callback_url: callbackUrl,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data?.message ?? 'Paystack initialize failed', details: data });
        }

        return res.status(200).json(data.data);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return res.status(500).json({ error: message });
    }
}
