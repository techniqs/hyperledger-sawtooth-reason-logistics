open Utils;
open UrlQueryParser;


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
  type params = unit;
  let parseParams = _ => ();
  let toUrl = _ => "/ware";
};


type page = 
 | HomePage
 | LoginPage
 | RegisterPage
 | WareDetailPage
 | WareResultsPage
 | UserDetailPage
 | UserResultsPage
 | ErrorPage;

 let toUrl = (page: page): string => {
  switch (page) {
  | HomePage => HomePage.toUrl()
  | LoginPage => LoginPage.toUrl()
  | RegisterPage => RegisterPage.toUrl()
  | WareDetailPage => WareDetailPage.toUrl()
  | WareResultsPage => WareResultsPage.toUrl()
  | UserDetailPage => UserDetailPage.toUrl()
  | UserResultsPage => UserResultsPage.toUrl()
  | ErrorPage => ErrorPage.toUrl()
  }};