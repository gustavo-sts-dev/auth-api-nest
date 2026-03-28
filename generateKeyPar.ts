import { exportPKCS8, exportSPKI, generateKeyPair } from 'jose';

async function genPair() {
  const { publicKey, privateKey } = await generateKeyPair('EdDSA', {
    extractable: true,
  });
  const privateKeyPem = await exportPKCS8(privateKey);
  const publicKeyPem = await exportSPKI(publicKey);

  const privateBase64 = Buffer.from(privateKeyPem).toString('base64');
  const publicBase64 = Buffer.from(publicKeyPem).toString('base64');

  console.log('private', privateBase64);
  console.log('public', publicBase64);
}

genPair().catch((e) => {
  console.error(e);
});
