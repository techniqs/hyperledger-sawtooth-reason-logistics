import userResolvers from '../resolvers/user';
import messageResolvers from '../resolvers/message';
import agentResolvers from '../resolvers/agent';
import { GraphQLScalarType } from 'graphql';

const dateResolver = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.toLocaleDateString("de-AT"); // value sent to the client
    },
  }),
}


export default [
  dateResolver,
  userResolvers,
  messageResolvers,
  agentResolvers,
];
