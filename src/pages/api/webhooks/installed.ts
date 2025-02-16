import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method?.toLowerCase() !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    const body = req.body;
    console.log('Received installed webhook', body);
    return res.status(200).json({ message: 'Webhook received' });
}
