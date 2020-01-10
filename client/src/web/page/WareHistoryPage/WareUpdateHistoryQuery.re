module Query = [%graphql
  {|
    query GetUpdateWareHistoryQuery($ean: String!){
        getUpdateHistory(ean: $ean) {
            owner
            location {
              latitude
              longitude
          }
            createdAt
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