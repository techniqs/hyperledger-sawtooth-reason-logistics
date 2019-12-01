import './config';

import models, { sequelize } from './utils/databaseConfig';
import Subscriber from './components/subscriber';
import {throwExceptionAndClose} from "./utils/exceptionHandler";


const eraseDB = process.env.DB_ERASE === "true" ? true : false;

const test = true;



// sequelize.sync({ force: eraseDB }).then(async () => {
const sub = new Subscriber("tcp://localhost:4004")
sub.start().then(() => { }).catch(err => {
  throwExceptionAndClose(sub,err);
})
// }).catch(err => {
// console.error("Error on sequelize start: ", err)
// });


process.on('SIGINT', function () {
  console.log("Caught interrupt signal, closing connections before exiting");

  sub.close()
  process.exit(0);
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

// createUsersWithMessages();

