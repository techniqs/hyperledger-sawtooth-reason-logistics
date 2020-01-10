import { createKeyPair, verifyKeys } from '../components/keyHandler';
import { hashPassword, signToken, checkAuth, encryptKey, decryptKey, genSalt } from '../components/authHandler';
import { createUserTransaction } from '../components/transactionCreation';
import { sendBatch } from '../components/requestHandler';
import moment from 'moment';

export default {
  Query: {
    loginUser: async (parent, { input }, { authorizedUser, models }) => {
      let user = await models.User.findOne({
        where: {
          username: input.username
        }
      });

      if (user !== null) {
        user = user.dataValues;
        const auth = (await models.Auth.findOne({
          where: {
            pubKey: user.pubKey
          }
        })).dataValues;

        const hash = hashPassword(input.password, auth.salt);
        const privKey = decryptKey(auth.encrypted_private_key, auth.iv, hash);
        if (privKey === null) {
          return { token: null, status: "INVALID"};
        };

        if (verifyKeys(privKey, auth.pubKey)) {
          return { token: signToken({ pubKey: auth.pubKey, hash: hash }), status: "OK"}
        }
        else {
          return { token: null, status: "INVALID"};
        }
      }
      return { token: null, status: "INVALID"};
    },
    listUsers: async (parent, { input }, { authorizedUser, models }) => {
      return (await models.User.findAll()).map(user => {
        const obj= {}
        obj["username"]=user.dataValues.username;
        obj["pubKey"]=user.dataValues.pubKey;
        obj["createdAt"] = moment.unix(user.dataValues.timestamp).format('DD/MM/YYYY, H:mm');
        return obj;
      });
    },
    getPrivateKey: async (parent, { input }, { authorizedUser, models }) => {

      checkAuth(authorizedUser);
      let auth = (await models.Auth.findOne({
        where: {
          pubKey: authorizedUser.token.pubKey
        }
      }))
      if (auth !== null) {
        auth = auth.dataValues;
        const privKey = decryptKey(auth.encrypted_private_key, auth.iv, authorizedUser.token.hash);
        return privKey;
      } else {
        throw new Error("couldnt find private key!");
      }
    },
  },
  Mutation: {
    createUser: async (parent, { input }, { authorizedUser, models }) => {

      const alreadyInDb = await models.User.findOne({
        attributes: ['username'],
        where: {
          username: input.username
        }
      });
      if (alreadyInDb === null) {

        const timestamp = moment().unix();
        const keyObj = createKeyPair();
        const batch = createUserTransaction(keyObj, input.username, timestamp);

        try {
          await sendBatch(batch);

          const salt = genSalt();
          const hash = hashPassword(input.password, salt);
          const { iv, encryptedKey } = encryptKey(keyObj.privKey, hash);

          models.Auth.create({
            pubKey: keyObj.pubKey,
            salt,
            iv,
            encrypted_private_key: encryptedKey,
          })

          return { token: signToken({ pubKey: keyObj.pubKey, hash: hash }), status: "OK"}


        } catch (err) {
          console.error(err);
          throw new Error(err)
        }
      } else {
        return { token: null, status: "INVALID"};
      }
    },
  },
};
