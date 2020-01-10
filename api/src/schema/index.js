import { gql } from 'apollo-server-express';

import userSchema from './user';
import wareSchema from './ware';

const rootSchema = gql`
  # scalar Date 

  type Query {
    #user queries
    
    loginUser(input:UserInput!): AuthObj!
    listUsers:[User!]!
    getPrivateKey:String!


    #ware queries
    getWare(ean:String!): WareWithDetails!
    listWares: [Ware!]!
    getUpdateHistory(ean:String!): [WareUpdates!]!
  }


  type Mutation {

    createUser(input: UserInput!): AuthObj!
    # return type status instead of Ware??
    createWare(input: WareInput!): WareResult!
    # return type status instead of Ware??
    # idk if this needs to be mandatory or not
    # for now i will do it mandatory dont know how to deal with it
    updateWare(input: WareInput!): WareResult!
    # transferWare(input: WareTransferInput!): WareResult!
  
  }



`;

export default [
  rootSchema,
  userSchema,
  wareSchema,
];
