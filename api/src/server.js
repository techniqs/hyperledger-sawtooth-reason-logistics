// from apollo
// https://www.apollographql.com/docs/apollo-server/getting-started/#next-steps

import './config';

import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import { authorize } from './components/authHandler'
import models, { sequelize, Op } from './utils/databaseConfig';
import { hashPassword, signToken, checkAuth, encryptKey, decryptKey, genSalt } from './components/authHandler';
import { createKeyPair, verifyKeys } from './components/keyHandler';



const app = express();

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  introspection: true,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message,
    };
  },
  context: async (ctx) => ({
    authorizedUser: await authorize(ctx),
    models
  }),
});

server.applyMiddleware({ app, path: '/graphiql' });

const port = process.env.APP_PORT;

const eraseDB = false;
// const eraseDB = process.env.DB_ERASE === "true" ? true : false;

const test = false;

// eyJhbGciOiJIUzI1NiJ9.ZXlKd2RXSkxaWGtpT2lJd016bGhNVEUwTmpRNVpqSXlOVE5qWVRRM1pEWTBOV0kwWXpnNE5EWTVZV0ZsTUdSbE9EQXlOamd3WlRSaU5tUmlaRGt4TURRME5tUTJaRFZpT0dGa1pHSWlMQ0pvWVhOb0lqb2lNV1ZsTmpBek5UazNPV1U0T1ROaE9UVm1aalV4WTJaa01UVXpaV1UxWldZd1pqZzVOVGd6WWpZek1XUm1ZMlkzWkRZMk5EYzNabVl6WXpjMFlURTFOQ0o5.FelAvvyivrq4aNv4b_-pSO9YRaoPKt5ppBuUlsNMDfg
sequelize.sync({ force: eraseDB }).then(async () => {

  if (test) {
    const keyObj = createKeyPair();
    const salt = genSalt();
    const hash = hashPassword("asdf", salt);

    const { iv, encryptedKey } = encryptKey(keyObj.privKey, hash);


    await models.Block.create({
      block_num: 1,
      block_id: "a683e986dee6c559045d9a42c23ebc101f0c0eafddff3aa3aba2cd62c397305b7aecca03d92894c577340df695b17b1890cba0c70c180a99814ee36adf7eb18f",
    });
    //pw asdf
    await models.User.create({
      pubKey: keyObj.pubKey,
      username: "techniqs",
      timestamp: 1578431460,
      start_block_num: 1,
      end_block_num: null,
    });
    await models.Auth.create({
      pubKey: keyObj.pubKey,
      salt,
      iv,
      encrypted_private_key: encryptedKey,
    });

    await models.Ware.create({
      ean: "1234567890",
      timestamp: 1578431460,
      start_block_num: 1,
      end_block_num: null,
    });

    await models.WareAttribute.create({
      ware_ean: "1234567890",
      name:"Flasche",
      uvp:13.99,
      timestamp: 1578431460,
      start_block_num: 1,
      end_block_num: null,
    });

    await models.WareLocation.create({
      ware_ean: "1234567890",
      timestamp: 1578431460,
      latitude:48.268047,
      longitude: 16.461505,
      start_block_num: 1,
      end_block_num: null,
    });

    await models.WareOwner.create({
      user_pubKey: keyObj.pubKey,
      ware_ean: "1234567890",
      timestamp: 1578431460,
      start_block_num: 1,
      end_block_num: null,
    });

    await models.Block.create({
      block_num: 2,
      block_id: "a683e986dee6c5590457890123eafddff3aa3aba2cd62c397305b7aecca03d92894c577340df695b17b1890cba0c70c180a99814ee36adf7eb18f",
    });



    await models.WareLocation.create({
      ware_ean: "1234567890",
      timestamp: 1578431462,
      latitude:48.186267,
      longitude: 16.353541,
      start_block_num: 2,
      end_block_num: 3,
    });

    await models.Block.create({
      block_num: 3,
      block_id: "a683e986dee6c559045d9a42ghjklhjascd62c397305b7aecca03d92894c577340df695b17b1890cba0c70c180a99814ee36adf7eb18f",
    });


    await models.WareLocation.create({
      ware_ean: "1234567890",
      timestamp: 1578431464,
      latitude:48.176770,
      longitude: 16.326401,
      start_block_num: 3,
      end_block_num: null,
    });
  }

  app.listen({ port }, () => {
    console.log(`Graphiql Server on http://localhost:${port}/graphiql`);
  });
}).catch(err => {
  console.error("Error on sequelize start: ", err)
});

