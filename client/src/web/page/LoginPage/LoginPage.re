[@react.component]
let make = () => {
  let (cookies, _) = Cookie.useCookies();
  if (Cookie.userLoggedIn(cookies)) {
    ReasonReactRouter.replace("/");
  };

  <Layout> <LoginForm /> </Layout>;
};