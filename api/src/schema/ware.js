import { gql } from 'apollo-server-express';


export default gql`
  ## type can be done together with client
  type WareWithDetails {
    ean:String!
    name: String!
    owner: User!
    locations:[Location!]!
    createdAt: String!,
    updatedAt: String!,
  }
  type Ware {
    ean:String!
    name: String!
    createdAt: String!,
  }

  type Location{
    latitude:Int!
    longitude:Int!
  }

  input WareInput {
    ean: String!
    name: String!
    longitude: Int!
    latitude: Int!
  }

  input WareTransferInput {
    ean: String!
    newOwner: String!
  }
`;
