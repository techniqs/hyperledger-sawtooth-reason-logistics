import { gql } from 'apollo-server-express';


export default gql`
  type User {
    pubKey: String!
    username: String!
  }
  type AuthObj {
    token: String!
    username: String!
  }

  input UserInput {
  username: String!
  password: String!
}
`;
