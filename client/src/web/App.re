include Style.GlobalStyle;

[@react.component]
let make =
    (
      ~apolloClient,
      ~initialUrl,
      // ~isUserLoggedIn,
      ~search,
      _children,
    ) => {
    <ReasonApollo.Provider client=apolloClient>
      // <User.Provider value=isUserLoggedIn>
        // <Responsive.Provider>
          // <UserEntry.Provider>
                      <Notification />
            <Router initialUrl search />
          // </UserEntry.Provider>
        // </Responsive.Provider>
      // </User.Provider>
    </ReasonApollo.Provider>
};
