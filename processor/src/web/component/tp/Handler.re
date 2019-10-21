//TODO Delete
class type _jsTester =
  [@bs]
  {};
type jsTester = Js.t(_jsTester);
[@bs.new] [@bs.module "./JsTester.js"]
external createJSTester: unit => jsTester = "default";

// type header;
// type payload;


class type _tpRequest =
  [@bs]
  {

    pub payload: Node.Buffer.t;
  };
  // pub header: string;

type tpRequest = Js.t(_tpRequest);

// type transactionProcessRequest = {
//   header,
//   // payload: Buffer.t,
//   payload,
// };

type context;

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

//Implementation for Js Wrapper SupplyHandler
module SupplyHandlerImpl = {
  include Payload;
  type t;

  let transactionFamilyName = "transactionFamilyName";
  let versions = [|"versions"|];
  let namespaces = [|"namespaces"|];

  let apply = (_t, transaction: tpRequest, context: context) => {
    // let header = transaction.header;
    // Payload Module, maybe use functor moduless? Slide 20
    let payload = transaction##payload;
    let state = context;

    Js.log2("Transaction", transaction);
    Js.log("------------------------");
    Js.log("------------------------");
    Js.log("------------------------");

    // Js.log2("payload", payload);
    Js.log2("payload", Node.Buffer.toString(payload));
    // Js.log2("Context", context);
  };
};