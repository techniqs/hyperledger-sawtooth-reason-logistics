type header = {
  batcherPublicKey: string,
  dependencies: array(string),
  familyName: string,
  familyVersion: string,
  inputs: array(string),
  nonce: string,
  outputs: array(string),
  payloadSha512: string,
  signerPublicKey: string,
};

type transactionRequest = {
  payload: Node.Buffer.t,
  header,
  signature: string,
  contextId: string,
};

[@bs.scope "JSON"] [@bs.val]
external convertTransaction: string => transactionRequest = "parse";

//Implementation for Js Wrapper SupplyHandler
module SupplyHandlerImpl = {
  open Payload;
  open State;

  let apply = (_t, transaction: transactionRequest, context: context) => {
    let header = transaction.header;
    let payloadBuffer = transaction.payload;
    let state = {context, timeout: 500};
    let payloadAction = decodePayloadAction(payloadBuffer);

    switch (payloadAction) {
    | CreateUser =>  
      StateFunctions.setUser(header.signerPublicKey, payloadBuffer, state)
    | SetWare => 
      StateFunctions.setWare(payloadBuffer, state, header.inputs)
    | _ =>
      Js.Promise.resolve(Js.Dict.empty());
    };
  };
};