// from apollo
// https://www.apollographql.com/docs/apollo-server/getting-started/#next-steps

import './config';

import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import { authorize, hashPassword, encryptKey, decryptKey, genSalt, signToken } from './components/authHandler'
import { createKeyPair, verifyKeys } from './components/keyHandler'
import models, { sequelize, Op } from './utils/databaseConfig';
import moment from 'moment';

const app = express();

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
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

const eraseDB = process.env.DB_ERASE === "true" ? true : false;

const test = false;

const qq = true;

export let fakeToken;
sequelize.sync({ force: eraseDB }).then(async () => {
  if (qq) {
    // const keys =createKeyPair();
    // console.log(verifyKeys(keys.privKey, keys.pubKey));
    await models.Block.create({
      block_num: 1,
      block_id: "8ed199b2c8f743eae6aa4ef89c407b6e508992705c2ab6d1aa332ff486dbdffc7095f6ab9e1d6dbf22827ec7ceacd5e7f7f254aee9870c09a0fb4aec06cd10fb",
    });
    //pw asdf
    await models.User.create({
      public_key: "025464702a00440bee85228779c745a5310ec141d4705238c8b6c38d3764fdeb4b",
      username: "techniqs",
      timestamp: 1578065323,
      start_block_num: 1,
      end_block_num: null,
    });
    await models.Auth.create({
      public_key: "025464702a00440bee85228779c745a5310ec141d4705238c8b6c38d3764fdeb4b",
      salt: "4200f273d787164d",
      iv: "7cf481ce78644e9fca582aa8a5794e46",
      encrypted_private_key: "b114149b35e4e775a4b73c4e162e250599309ebd5f5223db57a3b55896a2cbce5dc1ae8e28a88c0752f9faae5fb71122ea07da55333656087cf3b65ae81759bf54173c460cd2c662613cd47cb40812aa",
    });

    const hash = hashPassword("asdf", "4200f273d787164d");
    const privKey = decryptKey("b114149b35e4e775a4b73c4e162e250599309ebd5f5223db57a3b55896a2cbce5dc1ae8e28a88c0752f9faae5fb71122ea07da55333656087cf3b65ae81759bf54173c460cd2c662613cd47cb40812aa",
      "7cf481ce78644e9fca582aa8a5794e46", hash);
    if (verifyKeys(privKey, "025464702a00440bee85228779c745a5310ec141d4705238c8b6c38d3764fdeb4b")) {
      fakeToken = { token: signToken({ public_key: "025464702a00440bee85228779c745a5310ec141d4705238c8b6c38d3764fdeb4b", hash: hash }) }
    } else {
      fakeToken = null;
    }

  }

  if (test) {
    await models.Block.create({
      block_num: 1,
      block_id: "fztguio",
    });
    await models.Block.create({
      block_num: 2,
      block_id: "fztgaasdasuio",
    });

    await models.User.create({
      public_key: "qzugeq12312",
      username: "techniqs",
      timestamp: 12341523,
      start_block_num: 1,
      end_block_num: null,
    });
    await models.Auth.create({
      public_key: "qzugeq12312",
      salt: "qqqq",
      encrypted_private_key: "qwdsasdasdasd",
    });
    await models.Ware.create({
      ean: "1234567891234",
      name: "werkzeug",
      timestamp: moment().unix(),
      start_block_num: 1,
      end_block_num: null,
    });
    await models.Ware.create({
      ean: "12345678",
      name: "hammer",
      timestamp: moment().unix(),
      start_block_num: 1,
      end_block_num: null,
    });
    await models.WareOwner.create({
      user_pubKey: "qzugeq12312",
      ware_ean: "1234567891234",
      timestamp: moment().unix(),
      start_block_num: 1,
      end_block_num: null,
    });
    await models.WareLocation.create({
      ware_ean: "1234567891234",
      timestamp: moment().unix(),
      longitude: 20,
      latitude: -20,
      start_block_num: 1,
      end_block_num: null,
    });
    await models.WareLocation.update({
      end_block_num: 2,
    }, { where: { ware_ean: "1234567891234", start_block_num: 1 } });

    await models.WareLocation.create({
      ware_ean: "1234567891234",
      timestamp: moment().unix() + 2,
      longitude: 30,
      latitude: -40,
      start_block_num: 2,
      end_block_num: null,
    })
  }


  app.listen({ port }, () => {
    console.log(`Graphiql Server on http://localhost:${port}/graphiql`);
  });
}).catch(err => {
  console.error("Error on sequelize start: ", err)
});

