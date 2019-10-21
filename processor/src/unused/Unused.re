class type _jsTester =
  [@bs]
  {};
type jsTester = Js.t(_jsTester);
[@bs.new] [@bs.module "./JsTester.js"]
external createJSTester: unit => jsTester = "default";


//Binding to class SupplyHandler
class type _supplyHandler =
  [@bs]
  {
    pub apply: (string, string) => unit;
  };
// here need to say instead of string string, fix type!!

type supplyHandler = Js.t(_supplyHandler);
[@bs.new] [@bs.module "./HandlerJsWrapper"]
external createSupplyHandler: unit => supplyHandler = "default";


// some stuff worth leaving

// type hexBase64Latin1Encoding =
// | Latin1
// | Hex
// | Base64;

