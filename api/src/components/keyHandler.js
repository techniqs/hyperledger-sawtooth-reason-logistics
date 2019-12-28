import { createContext, CryptoFactory } from 'sawtooth-sdk/signing';

export const createKeyPair = () => {
    const context = createContext('secp256k1')
    const privateKey = context.newRandomPrivateKey()
    const pubKey = context.getPublicKey(privateKey);
    const signer = new CryptoFactory(context).newSigner(privateKey)
    return { signer: signer, pubKey: pubKey.asHex(), privKey: privateKey.asHex() };
}

