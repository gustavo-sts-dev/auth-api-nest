import { CryptoKey, importPKCS8, importSPKI } from 'jose';
import { $env } from './env.config';

let privateKey: CryptoKey;
let publicKey: CryptoKey;

async function initKeyPair() {
  const privateText = Buffer.from(
    $env.JWT_PRIVATE_KEY_BASE64,
    'base64',
  ).toString('utf-8');
  const publicText = Buffer.from($env.JWT_PUBLIC_KEY_BASE64, 'base64').toString(
    'utf-8',
  );

  const algorithm = 'EdDSA';
  privateKey = await importPKCS8(privateText, algorithm);
  publicKey = await importSPKI(publicText, algorithm);
}

export { privateKey, publicKey, initKeyPair };
