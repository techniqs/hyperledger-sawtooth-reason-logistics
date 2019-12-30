// from apollo
// https://www.apollographql.com/docs/apollo-server/getting-started/#next-steps

import './config';

import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import { authorize } from './components/authHandler'
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

const test = true;

sequelize.sync({ force: eraseDB }).then(async () => {
  // if (eraseDB) {
  // }

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
      encrypted_private_key: "qwdsasdasdasd",
    });
    await models.Ware.create({
      ean:"1234567891234",
      name:"werkzeug",
      timestamp: moment().unix(),
      start_block_num: 1,
      end_block_num: null,
    });
    await models.Ware.create({
      ean:"12345678",
      name:"hammer",
      timestamp: moment().unix(),
      start_block_num: 1,
      end_block_num: null,
    });
    await models.WareOwner.create({
      user_pubKey:"qzugeq12312",
      ware_ean:"1234567891234",
      timestamp:moment().unix(),
      start_block_num: 1,
      end_block_num: null,
    });
    await models.WareLocation.create({
      ware_ean:"1234567891234",
      timestamp:moment().unix(),
      longitude:20,
      latitude:-20,
      start_block_num: 1,
      end_block_num: null,
    });
    await models.WareLocation.update({
      end_block_num: 2,
    }, {where: {ware_ean:"1234567891234", start_block_num:1}});

    await models.WareLocation.create({
      ware_ean:"1234567891234",
      timestamp:moment().unix()+2,
      longitude:30,
      latitude:-40,
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

