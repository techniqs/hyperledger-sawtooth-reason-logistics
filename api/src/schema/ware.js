import { gql } from 'apollo-server-express';


export default gql`
  ## type can be done together with client
  type WareWithDetails {
    ean:String!
    name: String!
    owner: User!
    uvp: Float!
    locations:[Location!]!
    createdAt: String!,
    updatedAt: String!,
  }

  type Location{
    latitude:Int!
    longitude:Int!
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

  # TODOFAKE 
  # DELETE TOKEN 
  # UNCOMMENT OWNER 
  input WareInput {
    ean: String!
    name: String!
    longitude: Int!
    latitude: Int!
    uvp: Float!
    # owner optional, 
    # to know if its update of attributes or also transfership 
    owner: String
    token: String!
  }

  # input WareTransferInput {
  #   ean: String!
  #   newOwnerPubKey: String!
  # }
`;
 