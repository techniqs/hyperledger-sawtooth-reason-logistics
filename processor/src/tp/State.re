open Utils;
open Payload.Convert.TypesForWareState;
external stringDictToJson: Js.Dict.t(string) => Js.Json.t = "%identity";

external arrayDictToJson: Js.Dict.t(array(Js.Dict.t(string))) => Js.Json.t =
  "%identity";

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

//returns dict, if dict is empty at key: adress returns empty array as value, else buffer
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
    getState([|address|], state)
    |> Js.Promise.then_((result: Js.Dict.t(Node.Buffer.t)) =>
         switch (Js.Dict.get(result, address)) {
         | Some(adressData) =>
           Node.Buffer.isBuffer(adressData)
             ? {
               Js.log2("Data already saved at address: ", address);
               Exceptions.newInvalidTransactionException(
                 {j|Cannot create User! Public_key: $pubKey already exists!|j},
               );
               Js.Promise.resolve(result);
             }
             : {
               let parsedData = Payload.decodeUserData(buffer);
               Js.log2("Parsed Payload Data", parsedData);

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

  // set has no data at address
  // update without transfer has data
  //     but tpRequest has 2 addresses as inputs
  // update with transfer has data
  //     but tpRequest has 3 addresses as inputs

  let setWare = (buffer: Node.Buffer.t, state: state, inputs: array(string)) => {
    let parsedData = Payload.decodeWareData(buffer);
    Js.log2("Parsed Payload Data", parsedData);
    let address = Address.getWareAddress(parsedData.ean);
    getState([|address|], state)
    |> Js.Promise.then_((result: Js.Dict.t(Node.Buffer.t)) =>
         switch (Js.Dict.get(result, address)) {
         | Some(adressData) =>
           Node.Buffer.isBuffer(adressData)
             // UPDATE / TRANSFER
             ? {
               let savedWareData = Payload.decodeSavedWareData(adressData);
               Js.log2("Data saved at address: ", savedWareData);

               let containerDict = Js.Dict.empty();

               // IDENTIFIER
               let identifierDict = Js.Dict.empty();
               Js.Dict.set(identifierDict, "ean", parsedData.ean);
               Js.Dict.set(
                 identifierDict,
                 "timestamp",
                 savedWareData.identifier[0].timestamp,
               );

               Js.Dict.set(containerDict, "identifier", [|identifierDict|]);

               // ATTRIBUTES
               let attributesLength =
                 Array.length(savedWareData.attributes) - 1;

               if (parsedData.name
                   !== savedWareData.attributes[attributesLength].name  ||
                   parsedData.uvp
                   !== (savedWareData.attributes[attributesLength].uvp |> float_of_string)) {
                 let newAttribute: attributes = {
                   name: parsedData.name,
                   uvp: parsedData.uvp |> Js.Float.toString,
                   timestamp: parsedData.timestamp |> string_of_int,
                 };

                 let summarizedAttributes =
                   Array.append(savedWareData.attributes, [|newAttribute|]);
                 let attributesDict =
                   summarizedAttributes
                   |> Array.map((attr: attributes) => {
                        let dict = Js.Dict.empty();
                        Js.Dict.set(dict, "name", attr.name);
                        Js.Dict.set(dict, "uvp", attr.uvp);
                        Js.Dict.set(dict, "timestamp", attr.timestamp);
                        dict;
                      });
                 Js.Dict.set(containerDict, "attributes", attributesDict);
               } else {
                 let attributesDict =
                   savedWareData.attributes
                   |> Array.map((attr: attributes) => {
                        let dict = Js.Dict.empty();
                        Js.Dict.set(dict, "name", attr.name);
                        Js.Dict.set(dict, "uvp", attr.uvp);
                        Js.Dict.set(dict, "timestamp", attr.timestamp);
                        dict;
                      });
                 Js.Dict.set(containerDict, "attributes", attributesDict);
               };

               // LOCATIONS
               let locationLength = Array.length(savedWareData.locations) - 1;

               if (parsedData.longitude
                   !== (savedWareData.locations[locationLength].longitude |> float_of_string)
                   || parsedData.latitude
                   !== (savedWareData.locations[locationLength].latitude  |> float_of_string)) {
                 let newLocation: location = {
                   latitude: parsedData.latitude |> Js.Float.toString,
                   longitude: parsedData.longitude |> Js.Float.toString,
                   timestamp: parsedData.timestamp |> string_of_int,
                 };

                 let summarizedLocations =
                   Array.append(savedWareData.locations, [|newLocation|]);
                 let locationsDict =
                   summarizedLocations
                   |> Array.map((location: location) => {
                        let dict = Js.Dict.empty();
                        Js.Dict.set(dict, "latitude", location.latitude);
                        Js.Dict.set(dict, "longitude", location.longitude);
                        Js.Dict.set(dict, "timestamp", location.timestamp);
                        dict;
                      });
                 Js.Dict.set(containerDict, "locations", locationsDict);
               } else {
                 let locationsDict =
                   savedWareData.locations
                   |> Array.map((location: location) => {
                        let dict = Js.Dict.empty();
                        Js.Dict.set(dict, "latitude", location.latitude);
                        Js.Dict.set(dict, "longitude", location.longitude);
                        Js.Dict.set(dict, "timestamp", location.timestamp);
                        dict;
                      });
                 Js.Dict.set(containerDict, "locations", locationsDict);
               };

               // OWNER
               if (Array.length(inputs) === 3) {
                 let newOwner: owner = {
                   pubKey: parsedData.owner,
                   timestamp: parsedData.timestamp |> string_of_int,
                 };
                 let summarizedOwners =
                   Array.append(savedWareData.owners, [|newOwner|]);
                 let ownersDict =
                   summarizedOwners
                   |> Array.map((owner: owner) => {
                        let dict = Js.Dict.empty();
                        Js.Dict.set(dict, "pubKey", owner.pubKey);
                        Js.Dict.set(dict, "timestamp", owner.timestamp);
                        dict;
                      });
                 Js.Dict.set(containerDict, "owners", ownersDict);
               } else {
                 let ownersDict =
                   savedWareData.owners
                   |> Array.map((owner: owner) => {
                        let dict = Js.Dict.empty();
                        Js.Dict.set(dict, "pubKey", owner.pubKey);
                        Js.Dict.set(dict, "timestamp", owner.timestamp);
                        dict;
                      });
                 Js.Dict.set(containerDict, "owners", ownersDict);
               };
               Js.log2("Data saved to state: ", containerDict);

               let stateDict = Js.Dict.empty();
               Js.Dict.set(
                 stateDict,
                 address,
                 Node.Buffer.fromString(
                   Js.Json.stringify(arrayDictToJson(containerDict)),
                 ),
               );

               setState(stateDict, state);
             }
             // CREATE NEW WARE
             // IDENTIFIER
             : {
               let identifierDict = Js.Dict.empty();
               Js.Dict.set(identifierDict, "ean", parsedData.ean);
               Js.Dict.set(
                 identifierDict,
                 "timestamp",
                 parsedData.timestamp |> string_of_int,
               );

               let attributeDict = Js.Dict.empty();
               Js.Dict.set(attributeDict, "name", parsedData.name);
               Js.Dict.set(
                 attributeDict,
                 "uvp",
                 parsedData.uvp |> Js.Float.toString,
               );
               Js.Dict.set(
                 attributeDict,
                 "timestamp",
                 parsedData.timestamp |> string_of_int,
               );

               let ownerDict = Js.Dict.empty();
               Js.Dict.set(ownerDict, "pubKey", parsedData.owner);
               Js.Dict.set(
                 ownerDict,
                 "timestamp",
                 parsedData.timestamp |> string_of_int,
               );
               let locationDict = Js.Dict.empty();
               Js.Dict.set(
                 locationDict,
                 "latitude",
                 parsedData.latitude |> Js.Float.toString,
               );
               Js.Dict.set(
                 locationDict,
                 "longitude",
                 parsedData.longitude |> Js.Float.toString,
               );
               Js.Dict.set(
                 locationDict,
                 "timestamp",
                 parsedData.timestamp |> string_of_int,
               );

               let containerDict = Js.Dict.empty();
               Js.Dict.set(containerDict, "identifier", [|identifierDict|]);
               Js.Dict.set(containerDict, "attributes", [|attributeDict|]);
               Js.Dict.set(containerDict, "owners", [|ownerDict|]);
               Js.Dict.set(containerDict, "locations", [|locationDict|]);

               Js.log2("Data saved to state: ", containerDict);

               let stateDict = Js.Dict.empty();
               Js.Dict.set(
                 stateDict,
                 address,
                 Node.Buffer.fromString(
                   Js.Json.stringify(arrayDictToJson(containerDict)),
                 ),
               );

               setState(stateDict, state);
             }
         | _ =>
           raise(Exceptions.StateError("Couldnt get Dict from getState"))
         }
       );
  };
};