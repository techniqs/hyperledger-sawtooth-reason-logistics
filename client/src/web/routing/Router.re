module Result = Utils.Result;
let parseUrlWareDetailPage = Routes.WareDetailPage.parseParams;
let parseUrlWareHistoryPage = Routes.WareHistoryPage.parseParams;
let parseUrlWareEditPage = Routes.WareEditPage.parseParams;
let parseQuery = url => UrlQueryParser.parseQueryString(Some(url));

let urlToUrlList = url =>
  switch (url) {
  | ""
  | "/" => []
  | _ =>
    url
    |> Js.String.replaceByRe([%re "/^\\//g"], "")
    |> Js.String.replaceByRe([%re "/\\/$/g"], "")
    |> Js.String.split("/")
    |> Array.to_list
  };

let getQueryParams = (search: option(Js.Nullable.t(string))) => {
  switch (search) {
  | Some(s) => s |> Js.Nullable.toOption |> Utils.getOr("")
  | _ => ""
  };
};

let renderWithParams = (url, parseUrl, renderComponent) => {
  url |> parseQuery |> parseUrl |> Result.map(renderComponent);
};

let authorizedPage = (page, cookies: Cookie.cookies) => {
  let loggedIn = Cookie.userLoggedIn(cookies);

  loggedIn
    ? page
    : {
      ReasonReactRouter.replace("/");
      <HomePage />;
    };
};

let urlToPage = (url: ReasonReactRouter.url, cookies: Cookie.cookies) => {
  switch (url.path) {
  | ["users"] => Result.Ok(<UserResultsPage />)
  | ["wares"] => Result.Ok(<WareResultsPage />)
  | ["ware", url] =>
    renderWithParams(url, parseUrlWareDetailPage, params =>
      <WareDetailPage params />
    )
  | ["history", url] =>
    renderWithParams(url, parseUrlWareHistoryPage, params =>
      <WareHistoryPage params />
    )
  | ["edit", url] =>
    renderWithParams(url, parseUrlWareEditPage, params =>
      <WareEditPage params />
    )
  | ["create"] => Result.Ok(<WareCreatePage />)
  | ["login"] => Result.Ok(<LoginPage />)
  | ["register"] => Result.Ok(<RegisterPage />)
  | [] => Utils.Result.Ok(<HomePage />)
  | _ => Result.Ok(<ErrorPage />)
  };
};

let getUrlList =
    (~initialUrl=?, ~search: option(Js.Nullable.t(string))=?, ()) => {
  switch (initialUrl) {
  | None => ReasonReactRouter.useUrl()
  | Some(initialUrl) =>
    ReasonReactRouter.useUrl(
      ~serverUrl={
        path: urlToUrlList(initialUrl),
        hash: "",
        search: getQueryParams(search),
      },
      (),
    )
  };
};

[@react.component]
let make =
    (
      ~initialUrl: option(string)=?,
      ~search: option(Js.Nullable.t(string))=?,
    ) => {
  let (cookies, _) = Cookie.useCookies();

  let url = getUrlList(~initialUrl?, ~search?, ());

  // change to errorPage
  urlToPage(url, cookies) |> Result.getWithDefault(<ErrorPage />);
};