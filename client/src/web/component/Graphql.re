let cache = ApolloInMemoryCache.createInMemoryCache();

open Utils;
module String = Rebase.String;
let errorLink =
  ApolloLinks.createErrorLink(errorResponse => {
    let message =
      errorResponse##graphQLErrors
      |> Js.Nullable.toOption
      |> flatMap(error => Some(error |> Array.map(err => err##message)))
      |> getOr([||])
      |> List.fromArray
      |> String.joinWith(", ");

    Notification.error(~message);
    logError(message);
  });

type params = {
  .
  "credentials": string,
  "token": option(string),
};
let createLinks = (~params: params) => {
  let httpLink =
    switch (params##token) {
    | Some(t) =>
      ApolloLinks.createHttpLink(
        ~uri=Config.api,
        ~credentials=params##credentials,
        ~headers=
          Json.Encode.(
            object_([("Authorization", Js.Json.string({j|$t|j}))])
          ),
        (),
      )
    | _ =>
      ApolloLinks.createHttpLink(
        ~uri=Config.api,
        ~credentials=params##credentials,
        (),
      )
    };

  ApolloLinks.from([|errorLink, httpLink|]);
};