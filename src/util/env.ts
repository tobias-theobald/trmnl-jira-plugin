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

export const OAUTH_JIRA_CLIENT_ID = z
    .string({
        message:
            'OAUTH_JIRA_CLIENT_ID must be a non-empty string and can be obtained from the Atlassian developer console',
    })
    .min(1)
    .parse(process.env.OAUTH_JIRA_CLIENT_ID);

export const OAUTH_JIRA_CLIENT_SECRET = z
    .string({
        message:
            'OAUTH_JIRA_CLIENT_SECRET must be a non-empty string and can be obtained from the Atlassian developer console',
    })
    .min(1)
    .parse(process.env.OAUTH_JIRA_CLIENT_SECRET);

export const DATABASE_URL = z
    .string({ message: 'DATABASE_URL must be a non-empty string' })
    .min(1)
    .url('DATABASE_URL must be a valid URL')
    .startsWith('postgres://', 'DATABASE_URL must be a PostgreSQL URL')
    .parse(process.env.DATABASE_URL);

export const JWT_SECRET = z
    .string({
        message: `JWT_SECRET must be a non-empty 256-bit hex string (64 ASCII hex characters). You can generate it by running 'node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"'`,
    })
    .regex(/^[0-9a-f]{64}$/i)
    .parse(process.env.JWT_SECRET);

export const JWE_DB_TOKEN_SECRET = z
    .string({
        message: `JWE_DB_TOKEN_SECRET must be a non-empty 256-bit hex string (64 ASCII hex characters). You can generate it by running 'node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"'`,
    })
    .regex(/^[0-9a-f]{64}$/i)
    .parse(process.env.JWE_DB_TOKEN_SECRET);
