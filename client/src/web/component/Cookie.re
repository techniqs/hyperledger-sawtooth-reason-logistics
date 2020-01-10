// for every new cookie we need new type
[@bs.deriving abstract]
type cookies = {
  userToken: option(string),
  username: option(string),
};

[@bs.deriving abstract]
type cookiesOpt = {path: option(string)};

[@bs.module "react-cookie"]
external useCookiesInternal:
  unit => (cookies, (. string, string, cookiesOpt) => unit) =
  "useCookies";

let useCookies = () => {
  let (cookies, setCookies) = useCookiesInternal();
  (
    cookies,
    (key, value, ~options: cookiesOpt=cookiesOpt(~path=Some("/")), ()) => {
      setCookies(. key, value, options);
    },
  );
};

[@bs.module "react-cookie"]
external removeCookie: unit => (_, _, (. string) => unit) = "useCookies";


let getUserToken = (cookies: cookies) => {
  cookies |> userTokenGet;
};

let getUsername = (cookies: cookies) => {
  cookies |> usernameGet;
};


let userLoggedIn = (cookies: cookies) => {
  switch (cookies |> getUserToken) {
  | Some(_) => true
  | _ => false
  };
};


