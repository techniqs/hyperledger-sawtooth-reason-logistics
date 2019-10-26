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

let determinePayload = (payloadBuffer: Node.Buffer.t) => {
  let payloadAsString = Node.Buffer.toString(payloadBuffer);

  let payloadArray = Js.String.split(",", payloadAsString);
  if (Array.length(payloadArray) === 3) {
    let payload: payloadType = {
      name: payloadArray[0],
      action: toTypeAction(payloadArray[1]),
      space: payloadArray[2],
    };
    Js.log2("payload", payload);

    Some(payload);
  } else {
    None;
        // here array aint 3 so somethings wrong !
  };
};