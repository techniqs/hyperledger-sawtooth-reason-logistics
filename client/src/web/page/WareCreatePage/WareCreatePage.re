module Styles = WareResultsPageStyles;
open Cookie;
[@react.component]
let make = () => {
  let (cookies, _setCookies) = useCookies();
  if (!userLoggedIn(cookies)) {
    ReasonReactRouter.replace("/");
  };

  <Layout>
  <CreateWareForm/>
  </Layout>;
};