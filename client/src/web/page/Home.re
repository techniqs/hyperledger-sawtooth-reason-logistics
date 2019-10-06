open Utils;
[@react.component]
let make = () => {

  // Js.log2("Hash.namespace",Hash.nameSpace);
  // Js.log2("obj",Try.test);
  let supplyHandler2 = Handler.createSupplyHandler();
  supplyHandler2##apply("wtf", "wtf");

  <div> <p> {"BA " |> ReasonReact.string} </p> </div>;
};