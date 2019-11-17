type actions =
  | CreateAgent
  | CreateRecord
  | TransferRecord
  | UpdateRecord
  // Delete
  | Create
  // Delete
  | Take
  | NotDefined;

let toTypeAction = action => {
  switch (action) {
  | "create_agent" => CreateAgent
  | "create_record" => CreateRecord
  | "transfer_record" => TransferRecord
  | "update_record" => UpdateRecord
  // Delete
  | "create" => Create
  // Delete
  | "take" => Take
  | _ => NotDefined
  };
};

type payloadType = {
  name: string,
  action: actions,
  space: string,
};

type agentPayload = {
  action: actions,
  userName: string,
  createdAt: string,
};

let getPayloadArray = (payloadBuffer: Node.Buffer.t) => {
  let payloadAsString = Node.Buffer.toString(payloadBuffer);
  Js.String.split(",", payloadAsString);
};

let getPayloadAction = (payloadBuffer: Node.Buffer.t) => {
  let payloadAsString = Node.Buffer.toString(payloadBuffer);
  let payloadArray = Js.String.split(",", payloadAsString);
  toTypeAction(payloadArray[0]);
};

let getAgentPayload = (payloadBuffer: Node.Buffer.t) => {
  let payloadArray = getPayloadArray(payloadBuffer);
  let payload: agentPayload = {
    action: toTypeAction(payloadArray[0]),
    userName: payloadArray[1],
    createdAt: payloadArray[2],
  };
  payload;
};

// let determinePayload = (payloadBuffer: Node.Buffer.t) => {
//   let payloadAsString = Node.Buffer.toString(payloadBuffer);
//   let payloadArray = Js.String.split(",", payloadAsString);
//   Js.log2("PAYLOADARRAY", payloadArray);
//   if(payloadArray[0] === "create_agent" && Array.length(payloadArray) === 3){
//     // let payload: agentPayload = {
//     //   action: toTypeAction(payloadArray[0]),
//     //   userName: payloadArray[1],
//     //   createdAt: payloadArray[2]
//     // }
//     // Some(payload);
//     let payload: payloadType = {
//       name: payloadArray[0],
//       action: toTypeAction(payloadArray[1]),
//       space: payloadArray[2],
//     };
//     Some(payload);

//   } else if (Array.length(payloadArray) === 3) {
//     let payload: payloadType = {
//       name: payloadArray[0],
//       action: toTypeAction(payloadArray[1]),
//       space: payloadArray[2],
//     };
//     Js.log2("payload", payload);

//     Some(payload);
//   }
//   else {
//     None;
//   };
// };