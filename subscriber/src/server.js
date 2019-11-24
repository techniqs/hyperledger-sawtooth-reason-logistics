import './config';

import models, { sequelize } from './utils/database';
import {createKeyPair, wrapAndSendNewAgent} from './utils/keyHandler';


const eraseDB = process.env.DB_ERASE === "true" ? true : false;

const test = true;



// sequelize.sync({ force: eraseDB }).then(async () => {
//   if (eraseDB) {
    // createUsersWithMessages();
//   }
//   // if(test) {
//   //   console.log(wrapAndSendNewAgent("techniqs"));
//   // }

//   // while (true){
    
//   //   // do something
//   // }


// }).catch(err => {
  // console.error("Error on sequelize start: ", err)
// });

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

