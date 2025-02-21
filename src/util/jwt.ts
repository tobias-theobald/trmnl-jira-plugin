import { jwtDecrypt } from 'jose/jwt/decrypt';
import { EncryptJWT } from 'jose/jwt/encrypt';

import { JWT_SECRET } from '@/util/env';

const IDENTITY = 'trmnl-jira-plugin';

const issuer = `${IDENTITY}-issuer`;
const audience = `${IDENTITY}-audience`;
const secret = new Uint8Array(Buffer.from(JWT_SECRET, 'hex'));
const enc = 'A256GCM';

export const createJwt = async (uuid: string) => {
    const jwt = await new EncryptJWT({})
        .setProtectedHeader({ alg: 'dir', enc, typ: 'jwt' })
        .setIssuedAt()
        .setIssuer(issuer)
        .setAudience(audience)
        .setSubject(uuid)
        .setExpirationTime('1h')
        .encrypt(secret);
    console.log(jwt);
    return jwt;
};

export const verifyJwt = async (jwt: string) => {
    const decryptedJwt = await jwtDecrypt(jwt, secret, { issuer, audience });
    const subject = decryptedJwt.payload.sub;
    if (typeof subject !== 'string') {
        throw new Error('Invalid JWT subject');
    }
    return subject;
};
