// from sawtooth-sdk-javascript/processor/context.js
// context is our state
class type _context =
  [@bs]
  {
    pub getState:
      (array(string), int) => Js.Promise.t(Belt.Map.String.t(Node.Buffer.t));
  };
// (addresses,optional timeout) => Promise of map?

type context = Js.t(_context);

type state = {
  context,
  timeout: int,
};

let getState = (name: string, context: context) => {
  let address = Hash.xoAdress(name);
  context##getState([|address|], 500);
};
// |> Js.Promise.then_((result: Belt.Map.String.t(Node.Buffer.t)) => {
//      Js.log2("REUSLT", result);
//      Js.Promise.resolve(result);
//    })
//   |> Js.Promise.catch(_ => Js.Promise.resolve(Belt.Map.String.empty))
//   |> ignore;

module StateFunctions = {
  let loadGames = (name: string, state: state) => {
    getState(name, state.context);
  };

    //delete
  let getGame = (name: string, state: state) => {
    let address = Hash.xoAdress(name);
    loadGames(name, state)
    |> Js.Promise.then_((result: Belt.Map.String.t(Node.Buffer.t)) => {
         let getGame = Belt.Map.String.get(result, address);
         let game =
           switch (getGame) {
           | Some(game) => Node.Buffer.toString(game)
           | _ => ""
           };
         Js.log2("GAME ----", game);
         Js.Promise.resolve("result");
       })
    |> Js.Promise.catch(_ => Js.Promise.resolve("Belt.Map.String.empty"))
    |> ignore;
  };

    //delete
  let setGame = (name: string, state: state) => {
    Some(true);
  };

  let getAgent = (pubKey: string) => {
    Some(true);
  };

  let setAgent = () => {
    ();
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