type header;
type payload;

type transactionProcessRequest = {
  header: header,
  payload: payload,
  };

type context;

//Binding to class SupplyHandler
class type _supplyHandler =
  [@bs]
  {
    pub apply: (string, string) => unit;
  };
  // here need to say instead of string string, fix type!!

type supplyHandler = Js.t(_supplyHandler);
[@bs.new] [@bs.module "./HandlerJSWrapper.bs"]
external createSupplyHandler: unit => supplyHandler = "default";

//Implementation for Js Wrapper SupplyHandler
module SupplyHandlerImpl = {
  include Payload;
  type t;

  let transactionFamilyName = "transactionFamilyName";
  let versions = [|"versions"|];
  let namespaces = [|"namespaces"|];

  // let apply(_t, transactionProcessRequest, context) = {

  let apply =
      (
        _t,
        transaction: transactionProcessRequest,
        context: context,
      ) => {
    let header = transaction.header;
    // Payload Module, maybe use functor moduless? Slide 20
    let payload = transaction.header;
    let state = context;


    Js.log3("Implementation", transaction, context);
  };
}