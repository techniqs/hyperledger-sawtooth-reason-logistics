
type header;
class type _tpRequest =
  [@bs]
  {
    pub payload: Node.Buffer.t;
    pub header: header;
  };
type tpRequest = Js.t(_tpRequest);

type context;


//Implementation for Js Wrapper SupplyHandler
module SupplyHandlerImpl = {
  include Payload;

  type t;

  // let transactionFamilyName = "transactionFamilyName";
  // let versions = [|"versions"|];
  // let namespaces = [|"namespaces"|];

  let apply = (_t, transaction: tpRequest, context: context) => {
    let header = transaction##header;
    let payload = transaction##payload;
    let state = context;

    // Js.log2("Transaction", transaction);
    // Js.log("------------------------");
    // Js.log("------------------------");
    // Js.log("------------------------");


    Payload.determinePayload(payload);
    // Js.log2("Context", context);
  };
};