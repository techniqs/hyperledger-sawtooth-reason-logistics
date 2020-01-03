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

// delete
// let myHeaderObj = [%raw
//   "{ header:
//    { batcherPublicKey:
//       '03f46339f8eed25cfb9d33eee705bf7ee989d826fb3047a056c6473a7a8ebe7375',
//      familyName: 'sawtooth-reason-supply',
//      familyVersion: '0.1',
//      inputs:
//       [ '5d347c007adfcd2d303031fe162f01676f6614f24333d89bf289256cb02cd328d7dfd5' ],
//      nonce: '0.05629705790561723',
//      outputs:
//       [ '5d347c007adfcd2d303031fe162f01676f6614f24333d89bf289256cb02cd328d7dfd5' ],
//      payloadSha512:
//       'd1a5161dff51e77bdf64c3a4de5145d2fc352e59a427fb3f8e345fcb874604821dd8bf108bd9e6b6cd9381dc28161348c67fadfc640e3c78e29d938b6b011294',
//      signerPublicKey:
//       '032730a550a817942f565bf4cc8af918c92ab0da4d023c38e20925c31fe4c7df05' },
//   payload:
//    <Buffer 7b 22 61 63 74 69 6f 6e 22 3a 22 63 72 65 61 74 65 5f 75 73 65 72 22 2c 22 64 61 74 61 22 3a 7b 22 75 73 65 72 6e 61 6d 65 22 3a 22 33 33 22 2c 22 74 ... >,
//   signature:
//    '6d4029c28749777957a62488fca9d29edc1a6586d9638ed3809320b6f0bedc245aab5c324d5b9acf024d7cb03c6f97611edf85fed5231428ec9930040e5cb12c',
//   contextId: 'deb3ddd6e14e4faeb3ced04c6dd2133c' }"
// ];

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
      StateFunctions.setWare(header.signerPublicKey, payloadBuffer, state, header.inputs)
    | _ =>
      Js.Promise.resolve(Js.Dict.empty());
    };
  };
};