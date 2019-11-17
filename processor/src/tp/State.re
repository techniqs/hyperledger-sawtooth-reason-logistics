// from sawtooth-sdk-javascript/processor/context.js
// context is our state
class type _context =
  [@bs]
  {
    pub getState:
      (array(string), int) => Js.Promise.t(Belt.Map.String.t(Node.Buffer.t));
    // pub setState:
    //   ()
  
  };
// (addresses,optional timeout) => Promise of map?

type context = Js.t(_context);

type state = {
  context,
  timeout: int,
};

//Delete
let getStateXo = (name: string, context: context) => {
  let address = Address.xoAdress(name);
  context##getState([|address|], 500);
};

let getState = (address: array(string), state: state) => {
  state.context##getState(address, state.timeout);
};

// |> Js.Promise.then_((result: Belt.Map.String.t(Node.Buffer.t)) => {
//      Js.log2("REUSLT", result);
//      Js.Promise.resolve(result);
//    })
//   |> Js.Promise.catch(_ => Js.Promise.resolve(Belt.Map.String.empty))
//   |> ignore;

module StateFunctions = {
  //Delete
  let loadGames = (name: string, state: state) => {
    getStateXo(name, state.context);
  };

  //delete
  // let getGame = (name: string, state: state) => {
  //   let address = Address.xoAdress(name);
  //   loadGames(name, state)
  //   |> Js.Promise.then_((result: Belt.Map.String.t(Node.Buffer.t)) => {
  //        let getGame = Belt.Map.String.get(result, address);
  //        let game =
  //          switch (getGame) {
  //          | Some(game) => Node.Buffer.toString(game)
  //          | _ => ""
  //          };
  //        Js.log2("GAME ----", game);
  //        Js.Promise.resolve("result");
  //      })
  //   |> Js.Promise.catch(_ => Js.Promise.resolve("Belt.Map.String.empty"))
  //   |> ignore;
  // };

  //delete
  let setGame = (name: string, state: state) => {
    Some(true);
  };

  // let getAgent = (pubKey: string, state: state) => {
  //   let address = Address.getAgentAddress(pubKey);
  //   Js.log2("agentAddress", address);
  //   getState([|address|], state)
  //   |> Js.Promise.then_((result: Belt.Map.String.t(Node.Buffer.t)) => {
  //       //  let getGame = Belt.Map.String.get(result, address);
  //       //  let game =
  //       //    switch (getGame) {
  //       //    | Some(game) => Node.Buffer.toString(game)
  //       //    | _ => ""
  //       //    };
  //        Js.log2("RESULT ----", result);
  //        Js.Promise.resolve("result");
  //      })
  //   |> Js.Promise.catch(_ => Js.Promise.resolve("Belt.Map.String.empty"))
  //   |> ignore;

  //   true
  // };

  // let qq = [%bs.raw {|
  //          var exception = require("sawtooth-sdk/processor/exceptions");        
  //           throw new exception.InvalidTransaction("INVALID TRANSACTION");
  //           |}];   


                  // const { InvalidTransaction } = require("sawtooth-sdk/processor/exceptions");        
                  // throw new InvalidTransaction("INVALID TRANSACTION");   


  let setAgent = (pubKey: string,agentPayload:Payload.agentPayload, state: state) => {
    Js.log2("PubKEy", pubKey)
    let address = Address.getAgentAddress(pubKey);
    Js.log("SetAgent");
    getState([|address|], state)
    |> Js.Promise.then_((result: Belt.Map.String.t(Node.Buffer.t)) => {
         Js.log("IN PROMISE !!");
         Js.log3("WTFFF?????", result,address)
         Js.log2("EMPTY", Belt.Map.String.isEmpty(result));
         Js.log2("RESULT", result);
         Js.log2("ADDRESS", address);

        //  Js.log2("SIZE", Belt.Map.String.size(result));
        
        // here i wanted to save to blockchian, but map doesnt even let me do a get :(
         let getAgent = Belt.Map.String.get(result, "abc");


         // if agent return and throw invalid transaction agent with public key already exists..
            // Exceptions.newInvalidTransaction("INVALID TRANSACTION");   
         
              //  qq;
        //  let agent =
        //    switch (getAgent) {
        //    | Some(_) =>
        //      Js.log("AGENT FOUND")
        //     //  raise(Exceptions.Invalid_Transaction("AGENT ALREADY IN THER"))
        //    | _ => Js.log("NO AGENT !!")
        //    };

         Js.log2("RESULT ----", result);
         //  Js.Promise.reject(Exceptions.Invalid_Transaction("xD"));
         Js.Promise.resolve(result);
       })
    |> Js.Promise.catch(err => {
      Js.log2("error:",err);
      Js.Promise.resolve(Belt.Map.String.empty)})
      |> ignore
  };

  let getRecord = () => {
    ();
  };

  let setRecord = () => {
    ();
  };

  let transferRecord = () => {
    ();
  };

  let updateRecord = () => {
    ();
  };
};