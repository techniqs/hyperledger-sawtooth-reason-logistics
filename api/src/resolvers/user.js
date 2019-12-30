import { createKeyPair } from '../components/keyHandler';
import { hashPassword, signToken, checkAuth } from '../components/authHandler';
import { createUserTransaction } from '../components/transactionCreation';
import { sendBatch } from '../components/requestHandler';
import moment from 'moment';

export default {
  Query: {
    loginUser: async (parent, { input }, { authorizedUser, models }) => {
      const user = await models.User.findOne({
        where: {
          username: input.username
        }
      });


      if (user !== null) {
        console.log("user:", user.dataValues);

        // hash pw and decrypt private key, check if private and public are working together
        // const hashedPw = await hashPassword(input.password);
        // if everythings right then return token

        return { token: signToken(input.username), username: input.username }

      }

      // user not in db check error handling lol
      throw new Error("Wrong credentials!");
    },
    listUsers: async (parent, { input }, { authorizedUser, models }) => {
      return await models.User.findAll();
    },
    getPrivateKey: async (parent, { pw }, { authorizedUser, models }) => {

      console.log("privKey params", parent, pubKey, user, models)
      checkAuth(authorizedUser);
      // decrypt private key lol
      //still dunno how

      throw new Error("couldnt get PrivateKey");


    },
  },
  Mutation: {
    createUser: async (parent, { input }, { authorizedUser, models }) => {
      console.log("PARENT", parent);
      console.log("INPUT", input);

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


          const hashedPw = await hashPassword(input.password);
          // encrypt private key with hashed pw.. ? howto
          //   await models.Auth.create({
          //     public_key: keyObj.pubKey,
          //     encrypted_private_key: block.block_id,
          // })

          return { token: signToken(input.username), username: input.username }


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
