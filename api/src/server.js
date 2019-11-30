// from apollo
// https://www.apollographql.com/docs/apollo-server/getting-started/#next-steps

import './config';

import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './utils/database';
import {createKeyPair, wrapAndSendNewAgent} from './utils/keyHandler';

// import models, { sequelize } from './models';

const app = express();

// app.use(cors());


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
    me: await models.User.findByLogin('rwieruch'),
  }),
});

server.applyMiddleware({ app, path: '/graphiql' });

const port = process.env.APP_PORT;

const eraseDB = process.env.DB_ERASE === "true" ? true : false;

const test = true;

sequelize.sync({ force: eraseDB }).then(async () => {
  if (eraseDB) {
    // createUsersWithMessages();
  }
  if(test) {
    console.log(wrapAndSendNewAgent("techniqs"));
  }



  const agentCreatedAt = (new Date()).toLocaleDateString("de-DE");
  console.log("DATE ()", new Date());
  const qq = Date.parse(new Date())/1000;
  console.log("DATE parsed", qq);
  console.log("DATE parsed", new Date(qq*1000));
  console.log("DATE ??", agentCreatedAt);



  app.listen({ port }, () => {
    console.log(`Graphiql Server on http://localhost:${port}/graphiql`);
  });
}).catch(err => {
  console.error("Error on sequelize start: ", err)
});

const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: 'rwieruch',
      messages: [
        {
          text: 'Published the Road to learn React',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );

  // await models.Agent.create(
  //   {
  //     pubKey: 'TEST',
  //     userName: 'TEST'
  //   },
  // );

  await models.User.create(
    {
      username: 'ddavids',
      messages: [
        {
          text: 'Happy to release ...',
        },
        {
          text: 'Published a complete ...',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};
