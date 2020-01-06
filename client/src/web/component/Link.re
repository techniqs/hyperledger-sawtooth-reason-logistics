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

module Link2 = {
  [@react.component]
  let make = (~page: Routes.page, ~className="", ~children, ~full: bool=false) => {
    let href = Routes.toUrl(page);
    <a
      href
      className=Css.(
        merge([
          style([width(full?pct(100.):`auto)]),
          className,
        ])
      )
      onClick={event => {
        ReactEvent.Mouse.preventDefault(event);
        ReasonReactRouter.push(href);
      }}>
      children
    </a>;
  };
};
