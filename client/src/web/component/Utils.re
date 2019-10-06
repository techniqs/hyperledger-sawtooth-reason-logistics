
// [@bs.val] external requireModule: string => unit = "require";

module Result = {
  include Belt.Result;
  let mapWithDefault = (map, default, data) =>
    Belt.Result.mapWithDefault(data, default, map);
  let map = (map, data) => Belt.Result.map(data, map);
  let getWithDefault = (default, data) =>
    Belt.Result.getWithDefault(data, default);
};

// some stuff worth leaving

// type hexBase64Latin1Encoding =
// | Latin1
// | Hex
// | Base64;


//Binding to class SupplyHandler
// class type _supplyHandler =
//   [@bs]
//   {
//     // here need to say instead of string string, fix type!!
//     pub apply: (string, string) => unit;
//   };

// type supplyHandler = Js.t(_supplyHandler);
// [@bs.new] [@bs.module "./tp/SupplyHandler.bs"] external createSupplyHandler: unit => supplyHandler = "default";
