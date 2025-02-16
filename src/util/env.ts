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

export const DATABASE_URL = z
    .string({ message: 'DATABASE_URL must be a non-empty string' })
    .min(1)
    .url('DATABASE_URL must be a valid URL')
    .startsWith('postgres://', 'DATABASE_URL must be a PostgreSQL URL')
    .parse(process.env.DATABASE_URL);
