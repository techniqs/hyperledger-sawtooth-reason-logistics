// from apollo
// https://www.apollographql.com/docs/apollo-server/getting-started/#next-steps

import './config';

import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './utils/databaseConfig';
import { wrapAndSendNewAgent } from './components/requestHandler';
// import models, { sequelize } from './models';

const app = express();

//check how context works

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
  context: async () => ({
    models,
    // me: await models.User.findByLogin('rwieruch'),
  }),
});

server.applyMiddleware({ app, path: '/graphiql' });

const port = process.env.APP_PORT;

const eraseDB = process.env.DB_ERASE === "true" ? true : false;

const test = false;

sequelize.sync({ force: eraseDB }).then(async () => {
  // if (eraseDB) {
  // }

  if (test) {
    await  models.Block.create({
      block_num: 1,
      block_id: "fztguio",
  })
    await models.Agent.create({
      public_key: "qzugeq12312",
      username: "techniqs",
      timestamp: 12341523,
      start_block_num: 1,
      end_block_num: 1235913,
  })

    // wrapAndSendNewAgent({username:"techniqs",password:"1234"});
  }


  app.listen({ port }, () => {
    console.log(`Graphiql Server on http://localhost:${port}/graphiql`);
  });
}).catch(err => {
  console.error("Error on sequelize start: ", err)
});

