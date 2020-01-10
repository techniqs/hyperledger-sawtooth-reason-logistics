module Query = [%graphql
  {|
    query GetWareQuery($ean: String!){
        getWare(ean: $ean) {
          ean
          name
          owner {
              pubKey
              username
          }
          uvp
          locations {
              latitude
              longitude
          }
          createdAt
          updatedAt
        }
    }
  |}
];

module Element = Apollo.CreateQuery(Query);

[@react.component]
let make = (~ean: string, ~children: Query.MT_Ret.t => React.element) => {
  let params = Query.make(~ean={ean;}, ());

  <Element variables=params##variables>
    {(data: Query.MT_Ret.t) => children(data)}
  </Element>;
};