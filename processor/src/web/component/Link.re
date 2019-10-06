[@react.component]
let make = (~href, ~className="", ~children) => {
  <a
    href
    className
    onClick={event => {
      ReactEvent.Mouse.preventDefault(event);
      ReasonReactRouter.push(href);
    }}>
    children
  </a>;
};
