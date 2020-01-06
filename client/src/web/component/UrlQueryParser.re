type queryItem =
  | Single(string)
  | Multiple(list(string));

let makeSafe = (s: string): string => {
  Js.Global.decodeURI(Js.String.replaceByRe([%re "/\\+/g"], " ", s))
  |> Js.String.replaceByRe([%re "/&/g"], "&amp;")
  |> Js.String.replaceByRe([%re "/</g"], "&lt;")
  |> Js.String.replaceByRe([%re "/>/g"], "&gt;");
};

let equalSplit = [%bs.re "/=(.*)/g"];

let addKeyValue =
    (accumulator: Js.Dict.t(queryItem), kvPair: string)
    : Js.Dict.t(queryItem) => {
  switch (Js.String.splitByReAtMost(equalSplit, ~limit=2, kvPair)) {
  | [|Some(""), Some("")|] => accumulator
  | [|Some(key), Some(codedValue)|] =>
    let value = makeSafe(codedValue);
    switch (Js.Dict.get(accumulator, key)) {
    | None => Js.Dict.set(accumulator, key, Single(value))
    | Some(v) =>
      switch (v) {
      | Single(s) => Js.Dict.set(accumulator, key, Multiple([value, s]))
      | Multiple(m) => Js.Dict.set(accumulator, key, Multiple([value, ...m]))
      }
    };
    accumulator;
  | _ => accumulator
  };
};

[@bs.val] external decodeURIComponent: string => string = "decodeURIComponent";

let parseQueryString = (qString: option(string)): Js.Dict.t(queryItem) =>
  if (qString == None) {
    Js.Dict.fromList([]);
  } else {
    let result: Js.Dict.t(queryItem) = Js.Dict.fromList([]);

    let uri = decodeURIComponent(qString |> Utils.getOrEmpty);

    let hName =
      Js.String.replace(
        "|",
        "",
        Js.String.substring(
          ~from=0,
          ~to_=Js.String.lastIndexOf("|", uri) + 1,
          uri,
        ),
      );

    if (Js.String.indexOf("&", hName) === (-1)) {
      let kvPairs = Js.String.split("&", Js.String.replace("|", "", uri));
      Array.fold_left(addKeyValue, result, kvPairs);
    } else {
      let rest =
        Js.String.substring(
          ~from=Js.String.lastIndexOf("|", uri) + 1,
          ~to_=Js.String.length(uri),
          uri,
        );

      let kvPairs = Js.Array.concat([|hName|], Js.String.split("&", rest));

      Array.fold_left(addKeyValue, result, kvPairs);
    };
  };