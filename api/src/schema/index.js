import { gql } from 'apollo-server-express';

import userSchema from './user';
import messageSchema from './message';
import agentSchema from './agent';

const rootSchema = gql`
  scalar Date 

  type Query {
    #user queries
    users: [User!]
    user(id: ID!): User
    me: User
    #message queries
    messages: [Message!]!
    message(id: ID!): Message!
    #agent queries
    getAgent(pubKey: String!): Agent!
  }


  type Mutation {
    #message mutations
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }



`;

export default [
  rootSchema,
   userSchema,
    messageSchema,
     agentSchema,
    ];
