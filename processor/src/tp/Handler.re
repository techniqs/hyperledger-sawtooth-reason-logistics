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
let xoHeaderObj = [%raw
  "{ batcherPublicKey:
   '02037dd8a1039f5e6721ccfa29926846a60310e03a0cd665bfe7f05620d6f08a59',
  familyVersion: '1.0',
  familyName: 'xo',
  inputs:
   [ '5b73496ba2b9df31680dcda5a4a083c462109df7e1abf32ff25d82f8b3cbf9734de8ef' ],
  nonce: '0x1.76d1a8ea26e8dp+30',
  outputs:
   [ '5b73496ba2b9df31680dcda5a4a083c462109df7e1abf32ff25d82f8b3cbf9734de8ef' ],
  payloadSha512:
   '6b6e3e26a9e2e054d8d08ca87d59e01a07b81790b1c678d0fba0dba75965b7f06b9a6dff9bad0b2601957148d521c7be34b8b4e43d16b1d93bc997d21be4700f',
  signerPublicKey:
   '02037dd8a1039f5e6721ccfa29926846a60310e03a0cd665bfe7f05620d6f08a59' }"
];

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

external arrayDictToJson: Js.Dict.t(array(Js.Dict.t(string))) => Js.Json.t =
  "%identity";

type ware = {
  ean: string,
  name: string,
  timestamp: string,
};
type owner = {
  user_pubKey: string,
  ware_ean: string,
  timestamp: string,
};

type stateWare = {
  ware: Js.Dict.t(string),
  owner: array(Js.Dict.t(string)),
};

//Implementation for Js Wrapper SupplyHandler
module SupplyHandlerImpl = {
  open Payload;
  open State;

  let apply = (_t, transaction: transactionRequest, context: context) => {
    // i think i need to check if its my application xo and familyname right?
    // Js.log2("TRANSACTION", transaction);
    Js.log("------------------------------------------------------------------------------------------------------------------------");
    Js.log("------------------------------------------------------------------------------------------------------------------------");
    Js.log("------------------------------------------------------------------------------------------------------------------------");
    Js.log("------------------------------------------------------------------------------------------------------------------------");
    Js.log("------------------------------------------------------------------------------------------------------------------------");
    let header = transaction.header;
    Js.log3("transaction adresses", header.inputs, header.outputs)
    Js.log2("check if same adress," ,header.inputs[0] === header.outputs[0] );
    // Js.log3(
    //   "transaction input and key",
    //   header.inputs,
    //   header.signerPublicKey,
    // );
    let payloadBuffer = transaction.payload;
    let state = {context, timeout: 500};
    let payloadAction = decodePayloadAction(payloadBuffer);


    switch (payloadAction) {
    | CreateUser =>
      StateFunctions.setUser(header.signerPublicKey, payloadBuffer, state, header.inputs[0])
    // | CreateWare =>
    //   StateFunctions.setWare(header.signerPublicKey, payloadBuffer, state)
    | _ =>
      StateFunctions.setUser(header.signerPublicKey, payloadBuffer, state, header.inputs[0])
    };
  };
};