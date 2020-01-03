open Utils;

external stringDictToJson: Js.Dict.t(string) => Js.Json.t = "%identity";

external arrayDictToJson: Js.Dict.t(array(Js.Dict.t(string))) => Js.Json.t =
  "%identity";

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


let setState = (stateDict: Js.Dict.t(Node.Buffer.t), state: state) => {
  state.context##setState(stateDict, state.timeout)
  |> Js.Promise.then_((res: array(string)) => {
       Js.log2("Data sucessfully saved to adress: ", res);
       Js.Promise.resolve(stateDict);
     })
  |> Js.Promise.catch(err => {
       Js.log2("Error occured while saving to state: ", err);
       Js.Promise.resolve(Js.Dict.empty());
     });
};

module StateFunctions = {
  let setUser = (pubKey: string, buffer: Node.Buffer.t, state: state) => {
    let address = Address.getUserAddress(pubKey);
    Js.log2("setUser called with adress:", address);
    getState([|address|], state)
    |> Js.Promise.then_((result: Js.Dict.t(Node.Buffer.t)) =>
         switch (Js.Dict.get(result, address)) {
         | Some(adressData) =>
           Node.Buffer.isBuffer(adressData)
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
              
               let stateDict = Js.Dict.empty();
               Js.Dict.set(
                 stateDict,
                 address,
                 Node.Buffer.fromString(
                   Js.Json.stringify(stringDictToJson(userDict)),
                 ),
               );
               setState(stateDict, state);
             }
         | _ =>
           raise(Exceptions.StateError("Couldnt get Dict from getState"))
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

  let transferWare = () => {
    ();
  };

  let updateWare = () => {
    ();
  };
};