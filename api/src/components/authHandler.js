import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10; 
const SESSION_MAXAGE = 30 * 24 * 60 * 60 * 1000;
const SESSION_SECRET = 'cHgc8LAEcvMTTT9OitNMkfw4';

const signToken = data => {
    const token = jwt.sign(data, SESSION_SECRET, {expiresIn: '30d'});
    return token;
};

const verifyToken = token => {
    const data = jwt.verify(token, SESSION_SECRET);
    return data;
};

const hashPassword = async password => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

const comparePassword = async (password, hash) => {
    //password = input.pw
    //hash = hashedpw

    return bcrypt.compare(password, hash);
};

// const encryptPrivateKey = (privateKey, publicKey, )


export {signToken, verifyToken, hashPassword, comparePassword};
