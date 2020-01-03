open Utils;

external stringDictToJson: Js.Dict.t(string) => Js.Json.t = "%identity";

external arrayDictToJson: Js.Dict.t(array(Js.Dict.t(string))) => Js.Json.t = "%identity";

// from sawtooth-sdk-javascript/processor/context.js
// context is our state
class type _context =
  [@bs]
  {
    pub getState:
      (array(string), int) => Js.Promise.t(Js.Dict.t(Node.Buffer.t));
    pub setState:
      (Js.Dict.t(Node.Buffer.t), int) => Js.Promise.t(array(string));
  };

type context = Js.t(_context);

type state = {
  context,
  timeout: int,
};



//returns dict if nothing in that dict at adress returns empty array else buffer
let getState = (address: array(string), state: state) => {
  state.context##getState(address, state.timeout);
};

// idk why should i need to handle the promise.. i dont even know how to handle
// if theres returned adress aint same what to do
// |> Js.Promise.then_((res: array(string)) => {
//      Js.log2("IN SETSTATE PROMISE?", res);
//          raise(Exceptions.StateError("Resulting adress of state not the same as the one saved to!"));
//     //  Js.Promise.resolve(res);
//    })
//    |> ignore
let setState = (stateDict: Js.Dict.t(Node.Buffer.t), state: state) => {
  state.context##setState(stateDict, state.timeout)
  |> Js.Promise.then_((res: array(string)) => {
     Js.log2("Data sucessfully saved to adress: ", res);
     Js.Promise.resolve(res);
   })
   |> Js.Promise.catch(err => {
     Js.log2("Error occured while saving to state: ", err);
     Js.Promise.resolve([||]);
   })
   |> ignore;
};

module StateFunctions = {
  let setUser = (pubKey: string, buffer: Node.Buffer.t, state: state, input: string) => {
    let address = Address.getUserAddress(pubKey);
    Js.log2("setUser called with adress:", address);
    Js.log2("got same adress as input", address === input);
    getState([|address|], state)
    |> Js.Promise.then_((result: Js.Dict.t(Node.Buffer.t)) =>
         switch (Js.Dict.get(result, address)) {
         | Some(b) =>
           Node.Buffer.isBuffer(b)
             ? {
               Js.log("DATA ON ADRES!!");
               Exceptions.newInvalidTransactionException(
                 {j|Cannot create User! Public_key: $pubKey already exists!|j},
               );
               Js.Promise.resolve(result);
             }
             : {
               Js.log2("Buffer data:", Node.Buffer.toString(buffer));

               let parsedData = Payload.decodeUserData(buffer);
               Js.log2("PARSED DATA", parsedData);

               let userDict = Js.Dict.empty();
               Js.Dict.set(userDict, "pubKey", pubKey);
               Js.Dict.set(userDict, "username", parsedData.username);
               Js.Dict.set(
                 userDict,
                 "timestamp",
                 parsedData.timestamp |> string_of_int,
               );
               Js.log2("Data transfering to state:", userDict);
               Js.log2("STRINGIFY DICT ", Js.Json.stringify(stringDictToJson(userDict)));
              
               let stateDict = Js.Dict.empty();
               Js.Dict.set(
                 stateDict,
                 address,
                 Node.Buffer.fromString(
                   Js.Json.stringify(stringDictToJson(userDict)),
                 ),
               );
               Js.log2("STATEDICT ", stateDict);
               Js.log2("STATE", state);
               setState(stateDict, state);
               Js.Promise.resolve(result);
             }
         | _ =>
          Js.Promise.resolve(Js.Dict.empty());
          //  raise(Exceptions.StateError("Couldnt get Dict from getState"))
         }
       );
  };

  let setWare = (pubKey: string, buffer: Node.Buffer.t, state: state) => {
    let parsedData = Payload.decodeWareData(buffer);
    let address = Address.getWareAddress(parsedData.ean);
    getState([|address|], state)
    |> Js.Promise.then_((result: Js.Dict.t(Node.Buffer.t)) =>
         switch (Js.Dict.get(result, address)) {
         | Some(b) =>
           Node.Buffer.isBuffer(b)
             ? {
               Exceptions.newInvalidTransactionException(
                 {j|Cannot create Ware! EAN: $parsedData.ean already exists!|j},
               );
               Js.Promise.resolve(result);
             }
             : {
               Js.log2("Buffer data:", Node.Buffer.toString(buffer));
               //if tan says, just extend
               let wareDict = Js.Dict.empty();
               Js.Dict.set(wareDict, "ean", parsedData.ean);
               Js.Dict.set(wareDict, "name", parsedData.name);
               Js.Dict.set(wareDict, "timestamp", parsedData.timestamp |> string_of_int);
               
               let ownerDict = Js.Dict.empty();
               Js.Dict.set(ownerDict, "user_pubKey", pubKey);
               Js.Dict.set(ownerDict, "ware_ean", parsedData.ean);
               Js.Dict.set(ownerDict, "timestamp", parsedData.timestamp |> string_of_int);
               let locationDict = Js.Dict.empty();
               Js.Dict.set(locationDict, "ware_ean", parsedData.ean);
               Js.Dict.set(locationDict, "timestamp", parsedData.timestamp |> string_of_int);
               Js.Dict.set(locationDict, "longitude", parsedData.longitude |> string_of_int);
               Js.Dict.set(locationDict, "latitude", parsedData.latitude |> string_of_int);

               let containerDict = Js.Dict.empty();
               Js.Dict.set(containerDict, "ware", [|wareDict|]);
               Js.Dict.set(containerDict, "owners", [|ownerDict|]);
               Js.Dict.set(containerDict, "locations", [|locationDict|]);

              // if tan says dont extend then this
              // for update i take fields and just save into it.
              //  Js.Dict.set(wareDict, "ean", parsedData.ean);
              //  Js.Dict.set(wareDict, "name", parsedData.name);
              //  Js.Dict.set(wareDict, "timestamp", parsedData.timestamp |> string_of_int);
              //  Js.Dict.set(wareDict, "owner_pubKey", pubKey);
              //  Js.Dict.set(wareDict, "longitude", parsedData.longitude |> string_of_int);
              //  Js.Dict.set(wareDict, "latitude", parsedData.latitude |> string_of_int);

               Js.log2("Container:", containerDict);
               Js.log2("Container stringified", Js.Json.stringify(arrayDictToJson(containerDict)));

               let stateDict = Js.Dict.empty();
               Js.Dict.set(
                 stateDict,
                 address,
                 Node.Buffer.fromString(
                   Js.Json.stringify(arrayDictToJson(containerDict)),
                 ),
               );


              //  setState(stateDict, state);
               Js.Promise.resolve(result);
             }
         | _ =>
           raise(Exceptions.StateError("Couldnt get Dict from getState"))
         }
       );
  };

  let updateWare = () => {
    ();
  };

  let transferWare = () => {
    ();
  };

};