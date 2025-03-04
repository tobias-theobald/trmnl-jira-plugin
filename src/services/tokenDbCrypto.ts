import { compactDecrypt, CompactEncrypt } from 'jose';

import { JWE_DB_TOKEN_SECRET } from '@/util/env';

const secret = new Uint8Array(Buffer.from(JWE_DB_TOKEN_SECRET, 'hex'));
const alg = 'A256KW';
const enc = 'A256GCM';

export const decryptToken = async (encryptedToken: string) => {
    const { plaintext } = await compactDecrypt(encryptedToken, secret, {
        keyManagementAlgorithms: [alg],
        contentEncryptionAlgorithms: [enc],
    });
    const plaintextDecoded = new TextDecoder().decode(plaintext);

    console.log(plaintextDecoded);
    return plaintextDecoded;
};

export const encryptToken = async (plaintextToken: string) => {
    const plaintextEncoded = new TextEncoder().encode(plaintextToken);
    const jwe = await new CompactEncrypt(plaintextEncoded).setProtectedHeader({ alg, enc }).encrypt(secret);

    console.log(jwe);
    return jwe;
};
