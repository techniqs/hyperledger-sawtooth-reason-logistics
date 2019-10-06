[@bs.config {jsx: 3}];

[@react.component]
let make = (~initialUrl, ~locale, _children) => {
  Js.log("xDd");
  <div>
    // <ReactIntl.IntlProvider locale="de">
        <Router initialUrl />
    // </ReactIntl.IntlProvider>
  </div>;
};