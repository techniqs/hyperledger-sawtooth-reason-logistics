import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import models from '../utils/databaseConfig';
import { batchKeyPair } from './keyHandler'

const SALT_ROUNDS = 10;

const signToken = data => {
    const token = jwt.sign(Buffer.from(data).toString('base64'), batchKeyPair.privKey);
    return token;
};

const verifyToken = token => {
    const data = jwt.verify(token, batchKeyPair.privKey);
    return Buffer.from(data, 'base64').toString('ascii');
};

const hashPassword = async password => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

const user = true

const authorize = async (ctx) => {
    // console.log("CONTEXT REQUEST", ctx.req);

    // find user by header from request.
    // in token of header should be username, find it through that.
    if (user)
        return await models.User.findByPk(1);


    return null;

};

const checkAuth = (authorizedUser) => {
    if (authorizedUser === null)
        throw Error("not authorized!");
};

// here decode privateKey through public Key
const getPrivateKey = (pubKey) => {

    return "asdf";
    
}



export { signToken, verifyToken, hashPassword, checkAuth, authorize, getPrivateKey };
