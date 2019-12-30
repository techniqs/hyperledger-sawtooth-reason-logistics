open Utils;

external jsonDict: Js.Dict.t(string) => Js.Json.t = "%identity";


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

let getState = (address: array(string), state: state) => {
  state.context##getState(address, state.timeout);
};

let setState = (payload: Js.Dict.t(Node.Buffer.t), state: state) => {
  state.context##setState(payload, state.timeout);
};



// type everything like this
[@bs.deriving abstract]
type userData = {action: string, username: string, timestamp:string};

[@bs.scope "JSON"] [@bs.val]
external parseUser : string => userData = "parse";




module StateFunctions = {
  let setUser = (pubKey: string, userBuffer: Node.Buffer.t, state: state) => {
    Js.log2("setUser called, pubkey:", pubKey);
    let address = Address.getUserAddress(pubKey);
    getState([|address|], state)
    |> Js.Promise.then_((result: Js.Dict.t(Node.Buffer.t)) =>
         switch (Js.Dict.get(result, address)) {
         | Some(b) =>
           Node.Buffer.isBuffer(b)
             ? {
               Js.log("something @ adress, dont call setState");

               Exceptions.newInvalidTransactionException(
                 {j|Invalid Action: User with PublicKey: $pubKey ,already exists|j},
               );
               Js.Promise.resolve(result);
             }
             : {
               Js.log("no buffer, call setSTate");
              
               Js.log2("Buffer data:", Node.Buffer.toString(userBuffer));

               let parsedData = parseUser(Node.Buffer.toString(userBuffer));

               let dataObj = Js.Dict.empty();
               Js.Dict.set(dataObj,"pubKey",pubKey);
               Js.Dict.set(dataObj,"username",usernameGet(parsedData));
               Js.Dict.set(dataObj,"timestamp",timestampGet(parsedData));
               Js.log2("Data transfering to state:", dataObj);
                
                let stateDict = Js.Dict.empty();
               Js.Dict.set(stateDict, address, Node.Buffer.fromString(Js.Json.stringify(jsonDict(dataObj))));

               setState(stateDict, state)
               |> Js.Promise.then_((res: array(string)) => {
                    Js.log2("IN SETSTATE PROMISE?", res);
                    Js.Promise.resolve(result);
                  });
             }
             //  |> Js.Promise.catch(err => {
             //       Js.log2("error in setState", err);
             //       Js.Promise.resolve("qq");
             //     })
             //  |> ignore;
         | _ => Js.Promise.resolve(result)
         }
       );
    // |> Js.Promise.catch(err => {
    //      Js.log2("error in getState:", err);
    //      Js.Promise.resolve("Js.Json.");
    //    })
    // |> ignore;
  };

  let getWare = () => {
    ();
  };

  let setWare = () => {
    ();
  };

  let transferWare = () => {
    ();
  };

  let updateWare = () => {
    ();
  };
};