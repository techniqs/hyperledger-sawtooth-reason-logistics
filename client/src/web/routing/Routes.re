open Utils;
open UrlQueryParser;
let wrongParametersError = "wrong page parameters";


let toParam = (key: string, value) => {
  Some({j|$key=$value|j});
};

module HomePage = {
  type params = unit;
  let parseParams = _ => ();
  let toUrl = _ => "/";
};

module ErrorPage = {
  type params = unit;
  let parseParams = _ => ();
  let toUrl = _ => "";
};

module LoginPage = {
  type params = unit;
  let parseParams = _ => ();
  let toUrl = _ => "/login";
};

module RegisterPage = {
  type params = unit;
  let parseParams = _ => ();
  let toUrl = _ => "/register";
};

module UserResultsPage = {
  type params = unit;
  let parseParams = _ => ();
  let toUrl = _ => "/users";
};

module UserDetailPage = {
  type params = unit;
  let parseParams = _ => ();
  let toUrl = _ => "/user";
};
module WareResultsPage = {
  type params = unit;
  let parseParams = _ => ();
  let toUrl = _ => "/wares";
};

module WareDetailPage = {
  type params = {
    ean:string
  }

    let parseParams = urlData => {

      switch (getItem(urlData, "ean")) {
    | Some(ean) =>
      Result.Ok({
        ean
      })
    | _ => Result.Error(wrongParametersError)
      }
    }
    let toUrl = (params: params): string => {
    let parameters = toParam("ean", params.ean);

    {j|/ware/$parameters|j};
  };
};

module WareEditPage = {
  type params = {
    ean:string
  }

    let parseParams = urlData => {

      switch (getItem(urlData, "ean")) {
    | Some(ean) =>
      Result.Ok({
        ean
      })
    | _ => Result.Error(wrongParametersError)
      }
    }
    let toUrl = (params: params): string => {
    let parameters = toParam("ean", params.ean);

    {j|/edit/$parameters|j};
  };
};

module WareCreatePage = {
  type params = unit;
  let parseParams = _ => ();
  let toUrl = _ => "/create";
};


module WareHistoryPage = {
  type params = {
    ean:string
  }

    let parseParams = urlData => {

      switch (getItem(urlData, "ean")) {
    | Some(ean) =>
      Result.Ok({
        ean
      })
    | _ => Result.Error(wrongParametersError)
      }
    }
    let toUrl = (params: params): string => {
    let parameters = toParam("ean", params.ean);

    {j|/history/$parameters|j};
  };
};


type page = 
 | HomePage
 | LoginPage
 | RegisterPage
 | WareCreatePage
 | WareDetailPage(WareDetailPage.params)
 | WareHistoryPage(WareHistoryPage.params)
 | WareEditPage(WareEditPage.params)
 | WareResultsPage
 | UserDetailPage
 | UserResultsPage
 | ErrorPage;

 let toUrl = (page: page): string => {
  switch (page) {
  | HomePage => HomePage.toUrl()
  | WareCreatePage => WareCreatePage.toUrl()
  | LoginPage => LoginPage.toUrl()
  | RegisterPage => RegisterPage.toUrl()
  | WareDetailPage(data) => WareDetailPage.toUrl(data)
  | WareHistoryPage(data) => WareHistoryPage.toUrl(data)
  | WareEditPage(data) => WareEditPage.toUrl(data)
  | WareResultsPage => WareResultsPage.toUrl()
  | UserDetailPage => UserDetailPage.toUrl()
  | UserResultsPage => UserResultsPage.toUrl()
  | ErrorPage => ErrorPage.toUrl()
  }};