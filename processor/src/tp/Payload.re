module Payload = {
  type t;

  // wonderful record
  type payloadType = {
    name: string,
    action: string,
    space: string,
  };

  let determinePayload = (payloadBuffer: Node.Buffer.t) => {
    // Js.log2("PAYLOAD Buffer", payloadBuffer);
  
  //  let pArray = Js.String.split(",", Node.Buffer.toString(payloadBuffer));
   Js.log2("payload String", Node.Buffer.toString(payloadBuffer));

   


    // let payload = {name: pArray[0], action: pArray[1], space: pArray[2]};

    // Js.log2("qqq", payload);
    // Js.log2("qqq", payload.action);
    ();
  };
};