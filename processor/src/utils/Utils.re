
[@bs.val] external requireModule: string => unit = "require";

module Result = {
  include Belt.Result;
  let mapWithDefault = (map, default, data) =>
    Belt.Result.mapWithDefault(data, default, map);
  let map = (map, data) => Belt.Result.map(data, map);
  let getWithDefault = (default, data) =>
    Belt.Result.getWithDefault(data, default);
};

external stringToJson : string => Js.Json.t = "%identity";

module Exceptions = {
  exception StateError(string);


[@bs.module "../js/JsUtils"]
 external newInvalidTransactionException: string => unit = "newInvalidTransactionException";

 [@bs.module "../js/JsUtils"]
 external newInternalErrorException: string => unit = "newInternalErrorException";

}
