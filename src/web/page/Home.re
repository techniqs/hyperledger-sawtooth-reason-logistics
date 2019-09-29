open Utils;
[@react.component]
let make = () => {

  Js.log2("Hash.namespace",Hash.nameSpace);
  Js.log2("Handler obj",Try.test());



  <div> <p> {"BA " |> ReasonReact.string} </p> </div>;
};