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
        console.log("user:", user);
        const auth = (await models.Auth.findOne({
          where: {
            public_key: user.public_key
          }
        })).dataValues;

        const hash = hashPassword(input.password, auth.salt);
        const privKey = decryptKey(auth.encrypted_private_key, auth.iv, hash);
        if (verifyKeys(privKey, auth.public_key)) {
          return { token: signToken({ public_key: auth.public_key, hash: hash }) }
        }
        else {
          throw new Error("Login not successful, check credentials!");
        }
      }
      // user not in db check error handling lol
      throw new Error("Wrong credentials!");
    },
    listUsers: async (parent, { input }, { authorizedUser, models }) => {
      return await models.User.findAll();
    },
    getPrivateKey: async (parent, { input }, { authorizedUser, models }) => {

      checkAuth(authorizedUser);
      let auth = (await models.Auth.findOne({
        where: {
          public_key: authorizedUser.token.public_key
        }
      }))
      if (auth !== null) {
        auth = auth.dataValues;
        const privKey = decryptKey(auth.encrypted_private_key, auth.iv, authorizedUser.token.hash);
        return privKey;
      }
      throw new Error("couldnt get PrivateKey");
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
            public_key: keyObj.pubKey,
            salt,
            iv,
            encrypted_private_key: encryptedKey,
          })

          return { token: signToken({ public_key: keyObj.pubKey, hash: hash }) }


        } catch (err) {
          //check how to throw error
          throw new Error(err)
        }

      } else {
        // back to client
        throw new Error("Username not available.");
      }
    },
  },
};
