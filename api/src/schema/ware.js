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

  enum Status {
    OK
    ERROR
  }

  type WareResult {
    ean: String!
    status: Status!
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
    owner: String!
  }

  # input WareTransferInput {
  #   ean: String!
  #   newOwnerPubKey: String!
  # }
`;
 