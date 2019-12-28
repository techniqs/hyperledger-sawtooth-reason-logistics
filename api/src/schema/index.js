import { gql } from 'apollo-server-express';

import userSchema from './user';
import messageSchema from './message';
import userSchema from './user';

const rootSchema = gql`
  scalar Date 

  type Query {
    #user queries
    getUser(pubKey: String!): User!
    # getWare()
  }


  type Mutation {

    #user mutations
    createUser(input: UserInput!): User!
    createWare(input: WareInput!): Ware!
  
  }



`;

export default [
  rootSchema,
   userSchema,
    messageSchema,
     userSchema,
    ];
