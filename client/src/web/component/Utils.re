let str = React.string;

module Optional = {
  include Rebase.Option;
};

module List = {
  include Rebase.List;

  let filteri = (a, b) => Belt.List.keepWithIndex(b, a);
};

module Array = {
  include Rebase.Array;
  let fold_left = Array.fold_left;
  let sort = (b: ('a, 'a) => int, a: array('a)) =>
    Belt.SortArray.stableSortBy(a, b);
  let init = Array.init;
  let append = Array.append;
  let concat = Array.concat;
  let iteri = Array.iteri;
  let iter = Array.iter;
  let filteri = Js.Array.filteri;
  let replaceItem = (oldItem: 'a, newItem: 'a, arr: array('a)) => {
    arr |> Array.map(obj => obj === oldItem ? newItem : obj);
  };
  let diff = (array1: array('a), array2: array('a)) => {
    fst(
      array1
      |> reduce(
           ((result, remaining), item) => {
             let idx =
               remaining
               |> Optional.flatMap(r => r |> findIndex(i => i == item));
             switch (idx) {
             | None => (concat([[|item|], result]), remaining)
             | Some((idx, _)) => (
                 result,
                 remaining
                 |> Optional.map(r =>
                      r |> filteri((_, index) => index != idx)
                    ),
               )
             };
           },
           ([||], Some(array2)),
         ),
    );
  };
};

let flatMap = (map, data) => Belt.Option.flatMap(data, map);

let map = (map, data) => Belt.Option.map(data, map);
let mapWithDefault = (map, default, data) =>
  Belt.Option.mapWithDefault(data, default, map);

let keepMap = (map, data) => Belt.Array.keepMap(data, map);

let applyStyle = (a, b, c, func) =>
  switch (a, b, c) {
  | (Some(a), _, _) => Some(func(a))
  | (_, Some(b), _) => Some(func(b))
  | (_, _, Some(c)) => Some(func(c))
  | _ => None
  };

let filterNone = data => data |> keepMap(x => x);

let getOrEmpty = Rebase.Option.getOr("");

let getOr = Optional.getOr;

let logError = message =>
  if (Config.ssr) {
    Js.log3(
      "\x1b[31m",
      message,
      "\x1b[37m" // log red text in node console
    );
  } else {
    Js.log2(
      {j|%c$message|j},
      "color:red;" // log red text in browser
    );
  };

let renderOpt: ('a => React.element, option('a)) => React.element =
  (render, item) => {
    switch (item) {
    | Some(item) => render(item)
    | None => React.null
    };
  };

module Result = {
  include Belt.Result;
  let mapWithDefault = (map, default, data) =>
    Belt.Result.mapWithDefault(data, default, map);
  let map = (map, data) => Belt.Result.map(data, map);
  let getWithDefault = (default, data) =>
    Belt.Result.getWithDefault(data, default);
};

[@bs.val] external requireImage: string => string = "require";
[@bs.val] external requireCss: string => unit = "require";
[@bs.val] external requireModule: string => unit = "require";



[@bs.scope "window.location"] [@bs.val]
external reload: unit => unit = "reload";

[@bs.scope "window.location"] [@bs.val]
external replace: string => unit = "replace";

[@bs.scope "document"] [@bs.val]
external addKeybordEventListener:
  (string, ReactEvent.Keyboard.t => unit) => unit =
  "addEventListener";

[@bs.scope "document"] [@bs.val]
external removeKeybordEventListener:
  (string, ReactEvent.Keyboard.t => unit) => unit =
  "removeEventListener";


let validateEmail = (email: string) => {
  let emailRegex = [%bs.re "/\\S+@\\S+\\.\\S+/"];
  switch (Js.Re.exec_(emailRegex, email)) {
  | Some(_) => true
  | _ => false
  };
};
