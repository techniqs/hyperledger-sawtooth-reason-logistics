import { Op } from '../utils/databaseConfig';
import { sendBatch } from '../components/requestHandler';
import { createWareTransaction, updateWareTransaction, transferWareTransaction } from '../components/transactionCreation';
import { checkAuth, decryptKey } from '../components/authHandler';
import moment from 'moment';

export default {
  Query: {
    getWare: async (parent, { ean }, { authorizedUser, models }) => {

      let ware = (await models.Ware.findOne({
        where: {
          ean: ean
        }
      }))
      if (ware === null) {
        throw Error("Invalid EAN, ware couldn't be found!");
      }
      ware = ware.dataValues
      const wareLocations = (await models.WareLocation.findAll({
        where: {
          ware_ean: ean
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
          ware_ean: ean,
          end_block_num: {
            [Op.is]: null
          }
        }

      })).dataValues;

      const createdAt = moment.unix(ware.timestamp).format('DD/MM/YYYY, H:mm:ss')
      const updatedAtTimestamp = wareLocations[wareLocations.length - 1].timestamp < wareOwner.timestamp ?
        wareOwner.timestamp : wareLocations[wareLocations.length - 1].timestamp;


      const updatedAt = moment.unix(updatedAtTimestamp).format('DD/MM/YYYY, H:mm:ss')


      const wareUser = (await models.User.findOne({
        where: {
          pubKey: wareOwner.user_pubKey
        }
      })).dataValues;

      const owner = { pubKey: wareUser.pubKey, username: wareUser.username };

      return { ean: ware.ean, name: ware.name, owner, locations: wareLocations, createdAt, updatedAt };

    },

    // idk depends what i want to show check with client?
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
      checkAuth(authorizedUser);

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
      const auth = (await models.Auth.findOne({
        where: {
          pubKey: authorizedUser.token.pubKey
        }
      })).dataValues;

      const hash = authorizedUser.token.hash;
      const privKey = decryptKey(auth.encrypted_private_key, auth.iv, hash);

      const keyObj = { pubKey: auth.pubKey, privKey };

      const batch = createWareTransaction(keyObj, input, timestamp);

      try {
        await sendBatch(batch);

        return { ean: input.ean, status: "OK" };

      } catch (err) {

        throw new Error(err)
      }
    },

    // ean has to be same, cant be updated!
    updateWare: async (parent, { input }, { authorizedUser, models }) => {
      checkAuth(authorizedUser);

      const ware = (await models.Ware.findOne({
        where:
        {
          ean: input.ean
        }
      }));

      if (ware === null) {
        throw new Error("ware doesnt exist!");
      }

      const wareOwner = (await models.WareOwner.findOne({
        where:
        {
          ware_ean: input.ean
        }
      })).dataValues;

      if (wareOwner.user_pubKey !== authorizedUser.pubKey) {
        throw new Error("You are not the owner of this Ware!");
      }
      const timestamp = moment().unix();
      const auth = (await models.Auth.findOne({
        where: {
          pubKey: authorizedUser.token.pubKey
        }
      })).dataValues;

      const hash = authorizedUser.token.hash;
      const privKey = decryptKey(auth.encrypted_private_key, auth.iv, hash);

      const keyObj = { pubKey: auth.pubKey, privKey };

      const batch = updateWareTransaction(keyObj, input, timestamp);

      try {
        await sendBatch(batch);

        return { ean: input.ean, status: "OK" };

      } catch (err) {

        throw new Error(err)
      }

    },
    // transferWare: async (parent, { input }, { authorizedUser, models }) => {
    //   checkAuth(authorizedUser);

    //   const ware = (await models.Ware.findOne({
    //     where:
    //     {
    //       ean: input.ean
    //     }
    //   }));

    //   if (ware === null) {
    //     throw new Error("ware doesnt exist!");
    //   }

    //   const wareOwner = (await models.WareOwner.findOne({
    //     where:
    //     {
    //       ware_ean: input.ean
    //     }
    //   })).dataValues;

    //   if (wareOwner.user_pubKey !== authorizedUser.pubKey) {
    //     throw new Error("You are not the owner of this Ware!");
    //   }
    //   const timestamp = moment().unix();
    //   const auth = (await models.Auth.findOne({
    //     where: {
    //       pubKey: authorizedUser.token.pubKey
    //     }
    //   })).dataValues;

    //   const hash = authorizedUser.token.hash;
    //   const privKey = decryptKey(auth.encrypted_private_key, auth.iv, hash);

    //   const keyObj = { pubKey: auth.pubKey, privKey };

    //   const batch = transferWareTransaction(keyObj, input, timestamp);

    //   try {
    //     await sendBatch(batch);

    //     return { ean: input.ean, status: "OK" };

    //   } catch (err) {

    //     throw new Error(err)
    //   }

    // },
  },
};
