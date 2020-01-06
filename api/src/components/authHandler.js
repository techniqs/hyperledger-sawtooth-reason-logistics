import jwt from 'jsonwebtoken';
import models from '../utils/databaseConfig';
import { batchKeyPair, verifyKeys } from './keyHandler'
import crypto from 'crypto';

const genSalt = () => {
    return crypto.randomBytes(8).toString('hex');
};

const hashPassword = (pw, salt) => {
    const hash = crypto.createHmac("sha256", salt).update(pw).digest("hex");
    return hash;
}

export const encryptKey = (privKey, hash) => {
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(hash, "hex"), iv);
    let encrypted = cipher.update(privKey);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedKey: encrypted.toString('hex') };
};

export const decryptKey = (encryptedPrivKey, ivHex, hash) => {
    let iv = Buffer.from(ivHex, 'hex');
    let encryptedText = Buffer.from(encryptedPrivKey, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(hash, "hex"), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};


// signToken({ pubKey: auth.pubKey, hash: hash })
const signToken = data => {
    const token = jwt.sign(Buffer.from(JSON.stringify(data)).toString('base64'), batchKeyPair.privKey);
    return token;
};

const verifyToken = token => {
    const data = jwt.verify(token, batchKeyPair.privKey);
    return Buffer.from(data, 'base64').toString('ascii');
};


// TODO DELETE FAKE TOKEN!! AND GET TOKEN FROM HEADER!!
const authorize = async (ctx) => {
    // console.log("CONTEXT REQUEST", ctx.req);

    // find user by header from request.
    // in token of header should be username, find it through that.
    // something like in header authorization bearer 
    // then get token

    // delete fake token generator
    //get token from header!!

    return null;
    if(fakeToken === null){
        return null;
    }
    const data = verifyToken(fakeToken.token);
    const token = JSON.parse(data);
    let auth = (await models.Auth.findOne({
        where: {
            pubKey: token.pubKey
        }
    }))
    if (auth !== null) {
        auth = auth.dataValues;

        const privKey = decryptKey(auth.encrypted_private_key, auth.iv, token.hash);
        if (verifyKeys(privKey, token.pubKey)) {
            const user = await models.User.findOne({
                where: {
                    pubKey: token.pubKey
                }
            });
            if (user !== null) {
                return { user: user.dataValues, token: token };
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
