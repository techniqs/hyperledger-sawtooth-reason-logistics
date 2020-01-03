import { createContext, CryptoFactory } from 'sawtooth-sdk/signing';
import { Secp256k1PrivateKey } from 'sawtooth-sdk/signing/secp256k1';

const context = createContext('secp256k1');

export const createKeyPair = () => {
    const privateKey = context.newRandomPrivateKey()
    const pubKey = context.getPublicKey(privateKey);
    return { pubKey: pubKey.asHex(), privKey: privateKey.asHex() };
}

export const verifyKeys = (privKey, publicKey) => {
    const privKeyInstance = Secp256k1PrivateKey.fromHex(privKey);
    const realPubKey = context.getPublicKey(privKeyInstance);
    return realPubKey.asHex() === publicKey;
};

export const getSigner = (privKey) => {
    return new CryptoFactory(context).newSigner(Secp256k1PrivateKey.fromHex(privKey))
}

export const batchKeyPair = createKeyPair();
export const batchSigner = getSigner(batchKeyPair.privKey);
