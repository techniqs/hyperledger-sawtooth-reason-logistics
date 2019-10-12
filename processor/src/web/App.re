[@bs.config {jsx: 3}];

[@react.component]
let make = (~initialUrl, ~locale, _children) => {
  <div>
    // <ReactIntl.IntlProvider locale="de">
        <Router initialUrl />
    // </ReactIntl.IntlProvider>
  </div>;
};