import { z } from 'zod';

export const OAUTH_TRMNL_CLIENT_ID = z
    .string({
        message:
            'OAUTH_TRMNL_CLIENT_ID must be a non-empty string and can be obtained from the TRMNL plugin development settings',
    })
    .min(1)
    .parse(process.env.OAUTH_TRMNL_CLIENT_ID);

export const OAUTH_TRMNL_CLIENT_SECRET = z
    .string({
        message:
            'OAUTH_TRMNL_CLIENT_SECRET must be a non-empty string and can be obtained from the TRMNL plugin development settings',
    })
    .min(1)
    .parse(process.env.OAUTH_TRMNL_CLIENT_SECRET);
