import { gql } from 'apollo-server-express';


export default gql`
  ## type can be done together with client
  type Ware {
    name: String!
    username: String!
    createdAt: Date!
    updatedAt: Date!
  }

  input WareInput {
  name: String
  longitude: String
  latitude: String
}
`;
