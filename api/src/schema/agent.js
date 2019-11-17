import { gql } from 'apollo-server-express';


export default gql`
  type Agent {
    pubKey: String!
    userName: String!
    createdAt: Date!
    updatedAt: Date!
  }

  input AgentInput {
  userName: String
  pubKey: String
}
`;
