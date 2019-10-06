

module Result = Utils.Result;


let urlToUrlList = url =>
  switch (url) {
  | ""
  | "/" => []
  | _ =>
    url
    |> Js.String.replaceByRe([%re "/^\//g"], "")
    |> Js.String.replaceByRe([%re "/\/$/g"], "")
    |> Js.String.split("/")
    |> Array.to_list
  };


let urlToPage = (url: ReasonReactRouter.url) => {
  switch (url.path) {
  | [] => Utils.Result.Ok(<Home />)
  | _ => Result.Ok(<Home />)
  };
};

[@react.component]
let make = (~initialUrl:option(string)=?) => {
  let url: ReasonReactRouter.url =
    switch (initialUrl) {
    | None => ReasonReactRouter.useUrl()
    | Some(initialUrl) =>
      ReasonReactRouter.useUrl(
        ~serverUrl={path: urlToUrlList(initialUrl), hash: "", search: ""},
        (),
      )
    };
  urlToPage(url) |> Result.getWithDefault(<Home />);
};