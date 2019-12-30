import { gql } from 'apollo-server-express';

import userSchema from './user';
import wareSchema from './ware';

const rootSchema = gql`
  # scalar Date 

  type Query {
    #user queries
    
    loginUser(input:UserInput!): AuthObj!
    listUsers:[User!]!
    getPrivateKey(pw:String!):String!


    #ware queries
    getWare(id:Int!): WareWithDetails!
    listWares: [Ware!]!
  }


  type Mutation {

    createUser(input: UserInput!): AuthObj!
    # return type status instead of Ware??
    createWare(input: WareInput!): Ware!
    # return type status instead of Ware??
    # idk if this needs to be mandatory or not
    # for now i will do it mandatory dont know how to deal with it
    updateWare(input: WareInput!): Ware!
    transferWare(input: WareTransferInput!): Ware!
  
  }



`;

export default [
  rootSchema,
  userSchema,
  wareSchema,
];
