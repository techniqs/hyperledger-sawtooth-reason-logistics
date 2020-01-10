let createClassName = (list: list((bool, string))) => {
  list
  |> List.filter(((predicate, _)) => predicate)
  |> List.map(((_, className)) => className)
  |> String.concat(" ");
};

[@react.component]
let make =
    (
      ~src,
      ~fluid=false,
      ~rounded=false,
      ~roundedCircle=false,
      ~thumbnail=false,
      ~className="",
      ~onClick: ReactEvent.Mouse.t => unit=?,
    ) => {
  <img
    src
    style={ReactDOMRe.Style.make(~objectFit="cover", ())}
    className={
      createClassName([
        (fluid, "img-fluid"),
        (rounded, "rounded"),
        (roundedCircle, "rounded-circle"),
        (thumbnail, "img-thumbnail"),
      ])
      ++ className
    }
    onClick
  />;
};
