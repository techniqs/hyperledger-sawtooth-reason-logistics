module CreateQuery = (Config: ReasonApolloTypes.Config) => {
  module Query = ReasonApollo.CreateQuery(Config);

  // TODO (PAVEL): better error handling here
  [@react.component]
  let make = (~variables, ~children, ~skeleton: option(React.element)=?) => {
    <Query variables fetchPolicy="cache-and-network">
      ...{x =>
        switch (x.result) {
        | Loading =>
          skeleton
          |> Utils.getOr(
               {
                 "Lädt..." |> Utils.str;
               },
             )
        | Error(error) => <div> {ReasonReact.string(error##message)} </div>
        | Data(response) => children(response)
        }
      }
    </Query>;
  };
};

// TODO: create some abstraction above CreateQueryRaw and CreateQuery
module CreateQueryRaw = (Config: ReasonApolloTypes.Config) => {
  module Query = ReasonApollo.CreateQuery(Config);

  [@react.component]
  let make = (~variables, ~children: Query.renderPropObj => React.element) =>
    <Query variables fetchPolicy="cache-and-network">
      ...{result => children(result)}
    </Query>;
};

