import { Op } from '../utils/databaseConfig';
import { sendBatch } from '../components/requestHandler';
import { createWareTransaction, updateWareTransaction, transferWareTransaction } from '../components/transactionCreation';
import { checkAuth, decryptKey, verifyToken } from '../components/authHandler';
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

      const wareAttributes = (await models.WareAttribute.findOne({
        where:
        {
          ware_ean: ean,
          end_block_num: {
            [Op.is]: null
          }
        }
      })).dataValues;

      const createdAt = moment.unix(ware.timestamp).format('DD/MM/YYYY, H:mm')
      const updatedAtTimestamp =
        (wareLocations[wareLocations.length - 1].timestamp < wareOwner.timestamp) ?
          (wareOwner.timestamp < wareAttributes.timestamp ? wareAttributes.timestamp : wareOwner.timestamp) :
          (wareLocations[wareLocations.length - 1].timestamp < wareAttributes.timestamp ? wareAttributes.timestamp :
            wareLocations[wareLocations.length - 1].timestamp);

      const updatedAt = moment.unix(updatedAtTimestamp).format('DD/MM/YYYY, H:mm')

      const wareUser = (await models.User.findOne({
        where: {
          pubKey: wareOwner.user_pubKey
        }
      })).dataValues;

      const owner = { pubKey: wareUser.pubKey, username: wareUser.username };

      return { ean: ware.ean, name: wareAttributes.name, uvp: wareAttributes.uvp, owner, locations: wareLocations, createdAt, updatedAt };

    },

    listWares: async (parent, { input }, { authorizedUser, models }) => {
      let wares = await (await models.Ware.findAll()).map(async ware => {

        const attributes = (await models.WareAttribute.findOne({
          where: {
            ware_ean: ware.dataValues.ean,
            end_block_num: {
              [Op.is]: null
            }
          }
        })).dataValues
        const obj = {};
        obj["ean"] = ware.dataValues.ean;
        obj["name"] = attributes.name;
        obj["uvp"] = attributes.uvp;
        obj["createdAt"] = moment.unix(ware.dataValues.timestamp).format('DD/MM/YYYY, H:mm');

        return obj;
      });

      return wares;
    },
    getUpdateHistory: async (parent, { ean }, { authorizedUser, models }) => {
      let ware = (await models.Ware.findOne({
        where: {
          ean: ean
        }
      }))
      if (ware === null) {
        throw Error("Invalid EAN, ware couldn't be found!");
      }
      ware = ware.dataValues;

      const wareLocations = (await models.WareLocation.findAll({
        where: {
          ware_ean: ean
        }
      }))

      const wareOwners = (await models.WareOwner.findAll({
        where: {
          ware_ean: ean
        }
      }))

      // const updates = await (wareLocations.map(async location =>{
      //   const obj= {};
      //   obj["location"] = {longitude: location.dataValues.longitude, latitude: location.dataValues.latitude};
      //   let ownerFound = wareOwners.find(owner => owner.dataValues.start_block_num === location.dataValues.start_block_num);
      //   ownerFound = ownerFound === undefined ? wareOwners.find(owner => owner.dataValues.end_block_num === null): ownerFound;
      //   const user = (await models.User.findOne({
      //     where: {
      //       pubKey: ownerFound.dataValues.user_pubKey
      //     }
      //   })).dataValues;
      //   obj["owner"] = user.username;
      //   obj["createdAt"] = moment.unix(location.dataValues.timestamp).format('DD/MM/YYYY, H:mm');
      //   return obj;
      // }));

      const updates = await (wareLocations.map(async location => {
        let ownerFound;
        if (location.dataValues.end_block_num !== null) {
          ownerFound = wareOwners.find(owner => {
            if (owner.dataValues.end_block_num !== null) {
              if (
                owner.dataValues.start_block_num < location.dataValues.end_block_num &&
                owner.dataValues.end_block_num >= location.dataValues.end_block_num) {
                return owner;
              }

            } else {
              return owner;
            }
          })
        } else {
          ownerFound = wareOwners.find(owner => {
            if (owner.dataValues.end_block_num !== null) {
              if (location.dataValues.start_block_num <= owner.dataValues.end_block_num) {
                return owner;
              }
            } else {
              return owner;
            }
          })
        }


        const obj = {};
        obj["location"] = { longitude: location.dataValues.longitude, latitude: location.dataValues.latitude };
        // let ownerFound = wareOwners.find(owner => owner.dataValues.start_block_num === location.dataValues.start_block_num);
        // ownerFound = ownerFound === undefined ? wareOwners.find(owner => owner.dataValues.end_block_num === null): ownerFound;
        const user = (await models.User.findOne({
          where: {
            pubKey: ownerFound.dataValues.user_pubKey
          }
        })).dataValues;
        obj["owner"] = user.username;
        obj["createdAt"] = moment.unix(location.dataValues.timestamp).format('DD/MM/YYYY, H:mm');
        return obj;
      }));

      return updates;
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
        return { ean: input.ean, status: "INVALIDEAN" };
      }

      const timestamp = moment().unix();
      const auth = (await models.Auth.findOne({
        where: {
          pubKey: authorizedUser.token.pubKey
        }
      })).dataValues;

      // just to unify for input types
      if (input["owner"] === null || input["owner"] === undefined) {
        input["owner"] = auth.pubKey;
      }

      const hash = authorizedUser.token.hash;
      const privKey = decryptKey(auth.encrypted_private_key, auth.iv, hash);

      const keyObj = { pubKey: auth.pubKey, privKey };

      const batch = createWareTransaction(keyObj, input, timestamp);

      try {
        await sendBatch(batch);

        return { ean: input.ean, status: "OK" };

      } catch (err) {

        console.log(error);
        return { ean: input.ean, status: "ERROR" };

      }
    },

    updateWare: async (parent, { input }, { authorizedUser, models }) => {
      checkAuth(authorizedUser);

      const ware = (await models.Ware.findOne({
        where:
        {
          ean: input.ean
        }
      }));

      if (ware === null) {
        return { ean: input.ean, status: "INVALIDEAN" };
      }

      const wareOwner = (await models.WareOwner.findOne({
        where:
        {
          ware_ean: input.ean,
          end_block_num: {
            [Op.is]: null
          }
        }
      })).dataValues;

      if (wareOwner.user_pubKey !== authorizedUser.user.pubKey) {
        console.log("You are not the owner of this Ware!");
        return { ean: input.ean, status: "ERROR" };
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

      // so its unified and i just dont put owner in request in update
      // if i dont want to update
      if (input["owner"] === null || input["owner"] === undefined || input["owner"] === "") {
        input["owner"] = auth.pubKey;
      } else {
        const user = (await models.User.findOne({
          where: {
            username: input.owner
          }
        }));
        if (user === null) {
          return { ean: input.ean, status: "INVALIDUSER" };
        }
        input["owner"] = user.dataValues.pubKey;
      }
      const batch = updateWareTransaction(keyObj, input, timestamp);

      try {
        await sendBatch(batch);

        return { ean: input.ean, status: "OK" };

      } catch (err) {
        console.log(error);
        return { ean: input.ean, status: "ERROR" };
      }

    },
  },
};
