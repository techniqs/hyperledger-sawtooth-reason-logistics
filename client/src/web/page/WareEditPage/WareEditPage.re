module Styles = WareResultsPageStyles;
open Cookie;
[@react.component]
let make = (~params: string) => {
  let (cookies, _setCookies) = useCookies();
  if (!userLoggedIn(cookies)) {
    ReasonReactRouter.replace("/");
  };

  <Layout>
  <EditWareForm ean=params/>
  </Layout>;
};