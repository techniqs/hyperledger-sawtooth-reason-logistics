module Query = [%graphql
  {|
    query GetAllWares{
        listWares{
          ean,
          name,
          uvp,
          createdAt
    }
    }
  |}
];

module Element = Apollo.CreateQuery(Query);

[@react.component]
let make = (~children: Query.MT_Ret.t => React.element) => {
  let params =
    Query.make(
      (),
    );

  <Element variables=params##variables>
    {(data: Query.MT_Ret.t) => children(data)}
  </Element>;
};
