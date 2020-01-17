import jwt from 'jsonwebtoken';
import models from '../utils/databaseConfig';
import { batchKeyPair, verifyKeys } from './keyHandler'
import crypto from 'crypto';

// generates random Salt
const genSalt = () => {
    return crypto.randomBytes(8).toString('hex');
};

// hashes password with given salt
const hashPassword = (pw, salt) => {
    const hash = crypto.createHmac("sha256", salt).update(pw).digest("hex");
    return hash;
}

// encrypts a privatekey with the hashed password
export const encryptKey = (privKey, hash) => {
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(hash, "hex"), iv);
    let encrypted = cipher.update(privKey);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedKey: encrypted.toString('hex') };
};


// decrypts a private key
export const decryptKey = (encryptedPrivKey, ivHex, hash) => {
    try {
        let iv = Buffer.from(ivHex, 'hex');
        let encryptedText = Buffer.from(encryptedPrivKey, 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(hash, "hex"), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString()
    }
    catch (error) {
        console.log(error);
        return null;
    }
};

// signing a jwt token
const signToken = data => {
    const token = jwt.sign(Buffer.from(JSON.stringify(data)).toString('base64'), batchKeyPair.privKey);
    return token;
};

// verifies a jwt token
const verifyToken = token => {
    try {
        const data = jwt.verify(token, batchKeyPair.privKey);
        return Buffer.from(data, 'base64').toString('ascii');
    } catch (error) {
        console.log(error);
        return null;
    }
};

// checks if user is already login on request (to not authorize again in resolver methods)
const authorize = async (ctx) => {

    const headers = ctx.req.headers;
    if (headers.authorization == null) {
        return null;
    };
    const token = headers.authorization;
    const data = verifyToken(token);
    if (data === null) {
        return null;
    }
    const tokenData = JSON.parse(data);
    console.log("tokenDAta:", tokenData);
    let auth = (await models.Auth.findOne({
        where: {
            pubKey: tokenData.pubKey
        }
    }))
    if (auth !== null) {
        auth = auth.dataValues;

        const privKey = decryptKey(auth.encrypted_private_key, auth.iv, tokenData.hash);
        if (verifyKeys(privKey, tokenData.pubKey)) {
            const user = await models.User.findOne({
                where: {
                    pubKey: tokenData.pubKey
                }
            });
            if (user !== null) {
                return { user: user.dataValues, token: tokenData };
            }
        }
    }
    return null;

};

const checkAuth = (authorizedUser) => {
    if (authorizedUser === null)
        throw Error("not authorized!");
};


export { signToken, verifyToken, hashPassword, checkAuth, authorize, genSalt };
