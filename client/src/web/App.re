include Style.GlobalStyle;

// entrypoint of Reason

[@react.component]
let make = (~apolloClient, ~initialUrl, ~search, _children) => {
  <ReasonApollo.Provider client=apolloClient>
    <Notification />
    <Router initialUrl search />
  </ReasonApollo.Provider>;
};