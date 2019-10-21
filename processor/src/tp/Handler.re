
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

// let asdf = Payload.loadProtoFile("protos/qq.proto",Payload.callBack);


  type t;

  // let transactionFamilyName = "transactionFamilyName";
  // let versions = [|"versions"|];
  // let namespaces = [|"namespaces"|];

  let apply = (_t, transaction: tpRequest, context: context) => {
    let header = transaction##header;
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