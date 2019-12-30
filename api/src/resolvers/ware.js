import { Op } from '../utils/databaseConfig';
import { sendBatch } from '../components/requestHandler';
import { getSigner, createKeyPair, batchSigner, batchKeyPair } from '../components/keyHandler';
import { createWareTransaction, updateWareTransaction, transferWareTransaction } from '../components/transactionCreation';
import { checkAuth, getPrivateKey } from '../components/authHandler';
import moment from 'moment';

export default {
  Query: {
    getWare: async (parent, { id }, { authorizedUser, models }) => {

      let ware = (await models.Ware.findByPk(id));
      if (ware === null) {
        throw Error("ware not found.");
      }
      ware = ware.dataValues
      const wareLocations = (await models.WareLocation.findAll({
        where: {
          ware_id: id
        }
      })).map(wareLocation => {
        const obj = {};
        obj["longitude"] = wareLocation.dataValues.longitude;
        obj["latitude"] = wareLocation.dataValues.latitude;
        obj["timestamp"] = wareLocation.dataValues.timestamp;

        return obj;
      });

      const wareOwner = (await models.WareOwner.findOne({
        where:
        {
          ware_id: id,
          end_block_num: {
            [Op.is]: null
          }
        }

      })).dataValues;

      const createdAt = moment.unix(ware.timestamp).format('DD/MM/YYYY, H:mm:ss')
      const updatedAtTimestamp = wareLocations[wareLocations.length - 1].timestamp < wareOwner.timestamp ?
        wareOwner.timestamp : wareLocations[wareLocations.length - 1].timestamp;


      const updatedAt = moment.unix(updatedAtTimestamp).format('DD/MM/YYYY, H:mm:ss')

      const wareUser = (await models.User.findByPk(wareOwner.user_id)).dataValues;

      const owner = { pubKey: wareUser.public_key, username: wareUser.username };

      return { ean: ware.ean, name: ware.name, owner, locations: wareLocations, createdAt, updatedAt };

    },

    listWares: async (parent, { input }, { authorizedUser, models }) => {
      let wares = (await models.Ware.findAll()).map(ware => {
        const obj = {};
        obj["ean"] = ware.dataValues.ean;
        obj["name"] = ware.dataValues.name;
        obj["createdAt"] = moment.unix(ware.dataValues.timestamp).format('DD/MM/YYYY, H:mm:ss');

        return obj;
      });
      return wares;
    }


  },
  Mutation: {
    createWare: async (parent, { input }, { authorizedUser, models }) => {
      // checkAuth(authorizedUser);
      console.log("INPUT", input);

      const ware = (await models.Ware.findOne({
        where:
        {
          ean: input.ean
        }
      }));

      if (ware !== null) {
        throw new Error("ean already used!");
      }

      const timestamp = moment().unix();
      // getPrivateKey of authorizedUser
      const keyObj = { pubKey: authorizedUser.public_key, privKey: getPrivateKey(authorizedUser.public_key) };


      const batch = createWareTransaction(keyObj, input, timestamp);

      try {
        // await sendBatch(batch);




      } catch (err) {
        // HERE THROW ERROR TO CLIENT!!
        //check how to throw error
        console.log("in ware catch")
        console.log(err)
      }


    },
    updateWare: async (parent, { input }, { authorizedUser, models }) => {
      console.log("INPUT", input);

      const timestamp = moment().unix();
      // getPrivateKey of authorizedUser
      const keyObj = { pubKey: authorizedUser.public_key, privKey: getPrivateKey(authorizedUser.public_key)};


      const batch = updateWareTransaction(keyObj, input, timestamp);

      try {
        // await sendBatch(batch);




      } catch (err) {
        // HERE THROW ERROR TO CLIENT!!
        //check how to throw error
        console.log("in ware catch")
        console.log(err)
      }



    },
    transferWare: async (parent, { input }, { authorizedUser, models }) => {
      console.log("INPUT", input);
      // ean
      // newOwner

      let newUser = (await models.User.findOne({
        where:
        {
          username : input.newOwner
        }
      }));

      if(newUser === null){
        throw new Error("user doesn't exist!");
      }
      
      newUser= newUser.dataValues;

      console.log(newUser);

      const timestamp = moment().unix();
      // getPrivateKey of authorizedUser
      const keyObj = 
      { pubKey: authorizedUser.public_key, privKey: getPrivateKey(authorizedUser.public_key)};


      // const batch = transferWareTransaction(keyObj, input, timestamp);

      try {
        // await sendBatch(batch);




      } catch (err) {
        // HERE THROW ERROR TO CLIENT!!
        //check how to throw error
        console.log("in ware catch")
        console.log(err)
      }



    },
  },
};
