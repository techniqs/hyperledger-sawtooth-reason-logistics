// type payload

//create & encode will be needed for client. idc about this now
type payload;

class type _reflectionObject =
  [@bs]
  {};
  // pub create:
type reflectionObject = Js.t(_reflectionObject);

//Binding to class Root from protobufjs
class type _root =
  [@bs]
  {
    pub lookup: string => reflectionObject;
  };
  // do i need reflectionobject | null? dont think so since i decide payload

type root = Js.t(_root);
type error;

type loadCallBack = (error, root) => unit;

//implementatin of loadCallBack
let callBack: loadCallBack =
  (error, root) => {
    let qq = root##lookup("AwesomeMessage");

    // Js.log2("--------", root##lookup("AwesomeMessage"));
  };

[@bs.module "protobufjs"]
external loadProtoFile: (string, loadCallBack) => unit = "load";

type asdf = {age: int};

module Payload = {
  type t;

  let determinePayload = () => {
    

    Js.log("");
  }
};