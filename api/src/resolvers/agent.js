import { createKeyPair } from '../components/keyHandler';
import { hashPassword } from '../components/authHandler';
import { createAgentTransaction } from '../components/transactionCreation';
import { sendBatch } from '../components/requestHandler';
import moment from 'moment';

export default {
  Query: {
    getAgent: async (parent, { pubKey }, { models }) => {
      console.log("DAFUQ", pubKey);
      return await models.Agent.findByPk(pubKey);
    },
  },
  Mutation: {
    createAgent: async (parent, { input }, { models }) => {
      console.log("PARENT", parent);
      console.log("INPUT", input);

      const alreadyInDb = await models.Agent.findAll({
        attributes: ['username'],
        where: {
          username: input.username
        }
      });
      if (alreadyInDb.length === 0) {

        const timestamp = moment().unix();
        const keyObj = createKeyPair();
        const batch = createAgentTransaction(keyObj, input.username, timestamp);

        try {
          await sendBatch(batch);

          
          const hashedPw = await hashPassword(input.password);
          // encrypt private key with hashed pw.. ? howto
        //   await models.Auth.create({
        //     public_key: keyObj.pubKey,
        //     encrypted_private_key: block.block_id,
        // })


        } catch (err) {
          // HERE THROW ERROR TO CLIENT!!
          //check how to throw error
          console.log("in agent catch")
          console.log(err)
        }

      } else {
        // back to client
        console.log('\x1b[36m%s\x1b[0m', "USERNAME ALREADY IN DB!!");
      }
    },
  },
};
