open State;
open Utils;

// create user validation rules
// pubkey must be unique

let validateNewUser = (pubKey: string, state: state) => {
  let address = Address.getUserAddress(pubKey);
  getState([|address|], state)
  |> Js.Promise.then_((result: Js.Dict.t(Node.Buffer.t)) =>
       switch (Js.Dict.get(result, address)) {
       | Some(adressData) =>
         Node.Buffer.isBuffer(adressData)
           ? {
             Exceptions.newInvalidTransactionException(
               {j|Cannot create User! Public_key: $pubKey already exists!|j},
             );
             Js.Promise.resolve(result);
           }
           : Js.Promise.resolve(result)
       | _ => raise(Exceptions.StateError("Couldnt get Dict from getState"))
       }
     )
  |> Js.Promise.catch(err => {
       Js.log2("Error occured while validating user: ", err);
       Js.Promise.resolve(Js.Dict.empty());
     })
  |> ignore;
};

let validateExistingUser = (pubKey: string, state: state) => {
  let address = Address.getUserAddress(pubKey);
  getState([|address|], state)
  |> Js.Promise.then_((result: Js.Dict.t(Node.Buffer.t)) =>
       switch (Js.Dict.get(result, address)) {
       | Some(adressData) =>
         Node.Buffer.isBuffer(adressData)
           ? {
             Js.Promise.resolve(result);
           }
           : {
             Exceptions.newInvalidTransactionException(
               {j|User with public_key: $pubKey doesn't exist!|j},
             );
             Js.Promise.resolve(result);
           }
       | _ => raise(Exceptions.StateError("Couldnt get Dict from getState"))
       }
     )
  |> Js.Promise.catch(err => {
       Js.log2("Error occured while validating user: ", err);
       Js.Promise.resolve(Js.Dict.empty());
     })
  |> ignore;
};

let validateLongitude = (longitude: float) => {
  longitude >= (-180.) && longitude <= 180.
    ? Exceptions.newInvalidTransactionException(
        {j|Longitude must be between -180 and 180. Got $longitude|j},
      )
    : ();
};

let validateLatitude = (latitude: float) => {
  latitude >= (-90.) && latitude <= 90.
    ? Exceptions.newInvalidTransactionException(
        {j|Latitude must be between -90 and 90. Got $latitude|j},
      )
    : ();
};

// create ware validation rules
// owner is already user
// latitude and longitude are valid

// update ware validation rules
// owner is already user
// latitude and longitude are valid

// transfer ware validation rules
// newOwner is already user
// latitude and longitude are valid

let validateWare =
    (buffer: Node.Buffer.t, state: state) => {
  let parsedData = Payload.decodeWareData(buffer);
  let address = Address.getWareAddress(parsedData.ean);
  getState([|address|], state)
  |> Js.Promise.then_((result: Js.Dict.t(Node.Buffer.t)) =>
       switch (Js.Dict.get(result, address)) {
       | Some(adressData) =>
         Node.Buffer.isBuffer(adressData)
           // update / transfer
           ? {
             validateExistingUser(parsedData.owner, state);
             validateLongitude(parsedData.longitude);
             validateLatitude(parsedData.latitude);

             Js.Promise.resolve(result);
           }
           // create
           : {
             validateExistingUser(parsedData.owner, state);
             validateLongitude(parsedData.longitude);
             validateLatitude(parsedData.latitude);

             Js.Promise.resolve(result);
           }
       | _ => raise(Exceptions.StateError("Couldnt get Dict from getState"))
       }
     )
  |> Js.Promise.catch(err => {
       Js.log2("Error occured while validating ware: ", err);
       Js.Promise.resolve(Js.Dict.empty());
     })
  |> ignore;
};