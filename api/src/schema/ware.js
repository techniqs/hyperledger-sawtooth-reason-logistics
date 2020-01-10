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

  type WareUpdates {
    location:Location!
    owner: String!,
    createdAt: String!,
  }

  type Location{
    latitude:Float!
    longitude:Float!
  }

  type Ware {
    ean:String!
    name: String!
    uvp: Float!
    createdAt: String!,
  }

  enum Status {
    OK
    INVALIDEAN
    INVALIDUSER
    ERROR
  }

  type WareResult {
    ean: String!
    status: Status!
  }

  input WareInput {
    ean: String!
    name: String!
    longitude: Float!
    latitude: Float!
    uvp: Float!
    # owner optional, 
    # to know if its update of attributes or also transfership 
    owner: String
  }
`;
 