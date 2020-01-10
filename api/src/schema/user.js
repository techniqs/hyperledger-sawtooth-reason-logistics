import { gql } from 'apollo-server-express';


export default gql`
  type User {
    pubKey: String!
    username: String!
    createdAt: String!
  }
  enum LoginStatus {
    OK
    INVALID
  }
  type AuthObj {
    token: String
    status: LoginStatus!
  }

  input UserInput {
  username: String!
  password: String!
}
`;
