import { gql } from 'apollo-server-express';


export default gql`
  type User {
    pubKey: String!
    username: String!
    createdAt: Date!
    updatedAt: Date!
  }

  input UserInput {
  username: String
  password: String
}
`;
