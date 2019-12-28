type actions =
  | CreateUser
  | CreateWare
  | TransferWare
  | UpdateWare
  // Delete
  | Create
  // Delete
  | Take
  | NotDefined;

let toTypeAction = action => {
  switch (action) {
  | "create_user" => CreateUser
  | "create_ware" => CreateWare
  | "transfer_ware" => TransferWare
  | "update_ware" => UpdateWare
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

type userPayload = {
  action: actions,
  username: string,
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

let getUserPayload = (payloadBuffer: Node.Buffer.t) => {
  let payloadArray = getPayloadArray(payloadBuffer);
  let payload: userPayload = {
    action: toTypeAction(payloadArray[0]),
    username: payloadArray[1],
    createdAt: payloadArray[2],
  };
  payload;
};



// let determinePayload = (payloadBuffer: Node.Buffer.t) => {
//   let payloadAsString = Node.Buffer.toString(payloadBuffer);
//   let payloadArray = Js.String.split(",", payloadAsString);
//   Js.log2("PAYLOADARRAY", payloadArray);
//   if(payloadArray[0] === "create_user" && Array.length(payloadArray) === 3){
//     // let payload: userPayload = {
//     //   action: toTypeAction(payloadArray[0]),
//     //   username: payloadArray[1],
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