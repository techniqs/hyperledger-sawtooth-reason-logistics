[@react.component]
let make = (~icon, ~className="", ~full=false) => {
  let src =
    try (Utils.requireImage({j|./icons/$icon.svg|j})) {
    | _ => {j|$icon.svg|j}
    };
  <img
    src
    className=Css.(
      merge([
        style([width(full ? pct(100.) : `initial), maxWidth(pct(100.))]),
        className,
      ])
    )
  />;
};
