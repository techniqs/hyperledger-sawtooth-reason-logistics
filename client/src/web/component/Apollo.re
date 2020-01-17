module CreateQuery = (Config: ReasonApolloTypes.Config) => {
  module Query = ReasonApollo.CreateQuery(Config);

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