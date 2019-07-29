module Result {
  include Belt.Result;
  let mapWithDefault = (map, default, data) => Belt.Result.mapWithDefault(data, default, map);
  let map = (map, data) => Belt.Result.map(data, map);
  let getWithDefault = (default, data) => Belt.Result.getWithDefault(data, default);
}