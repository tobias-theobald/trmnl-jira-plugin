import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { dbInit } from '@/data-source';
import { authenticateTrmnlWebhook } from '@/util/authentication';

const TrmnlInstalledWebhook = z.object({
    user: z.object({
        name: z.string(),
        email: z.string(),
        first_name: z.string(),
        last_name: z.string(),
        locale: z.string(),
        time_zone: z.string(),
        time_zone_iana: z.string(),
        utc_offset: z.number(),
        uuid: z.string().uuid(),
    }),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const authnResult = await authenticateTrmnlWebhook(req, res);
    if (!authnResult.success) {
        return;
    }
    const connection = authnResult.data;
    const { TrmnlConnectionRepository } = await dbInit();

    console.debug('Received installed webhook', req.body);
    const bodyParsed = TrmnlInstalledWebhook.safeParse(req.body);
    if (!bodyParsed.success) {
        return res.status(400).json({ message: 'Invalid body', errors: bodyParsed.error });
    }

    console.debug('Updating connection');
    const {
        user: { locale, time_zone_iana, uuid },
    } = bodyParsed.data;

    // Update connection
    connection.locale = locale;
    connection.timeZoneIana = time_zone_iana;
    connection.uuid = uuid;
    await TrmnlConnectionRepository.save(connection);

    console.info('Plugin installed successfully');
    return res.status(200).json({ message: 'OK' });
}
