import { gql } from 'apollo-server-express';


export default gql`
  type Agent {
    pubKey: String!
    username: String!
    createdAt: Date!
    updatedAt: Date!
  }

  input AgentInput {
  username: String
  password: String
}
`;
