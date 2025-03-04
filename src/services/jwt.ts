import { jwtDecrypt } from 'jose/jwt/decrypt';
import { EncryptJWT } from 'jose/jwt/encrypt';

import { JWT_SECRET } from '@/util/env';

const IDENTITY = 'trmnl-jira-plugin';

const issuer = `${IDENTITY}-issuer`;
const secret = new Uint8Array(Buffer.from(JWT_SECRET, 'hex'));
const alg = 'A256KW';
const enc = 'A256GCM';

export type JwtAudience = 'manage' | 'atlassian-state' | 'atlassian-cookie';

export const createJwt = async (uuid: string, audience: JwtAudience) => {
    const jwt = await new EncryptJWT({})
        .setProtectedHeader({ alg, enc, typ: 'jwt' })
        .setIssuedAt()
        .setIssuer(issuer)
        .setAudience(audience)
        .setSubject(uuid)
        .setExpirationTime('1h')
        .encrypt(secret);
    console.log(jwt);
    return jwt;
};

export const verifyJwt = async (jwt: string, audience: JwtAudience) => {
    const decryptedJwt = await jwtDecrypt(jwt, secret, {
        keyManagementAlgorithms: [alg],
        contentEncryptionAlgorithms: [enc],
        issuer,
        audience,
    });
    const subject = decryptedJwt.payload.sub;
    if (typeof subject !== 'string') {
        throw new Error('Invalid JWT subject');
    }
    return subject;
};
