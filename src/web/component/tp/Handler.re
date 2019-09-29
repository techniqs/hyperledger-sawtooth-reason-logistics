
// BS cant extend JS Classes since it generates code that's backwards-compatible with ES5
// So it doesnt know anything about classes yet
// https://stackoverflow.com/questions/46454098/how-to-extend-js-class-in-reasonml
// need to use bs.raw (which compiles to pure js) to extend classes

// https://reasonml.chat/t/extending-a-javascript-class/1386/12
// idk maybe this helps
// btw slide 17-18

[%%bs.raw {|

const { TransactionHandler } = require('sawtooth-sdk/processor/handler')


class SupplyHandler extends TransactionHandler {

  constructor(transactionFamilyName, versions, namespaces) {
    super();
  }

  speak() {
    console.log(`${this._name} says woof!!`);
    super.speak();
  }
}
|}];


module Animal_Dog = {
  type t;

  [@bs.new] external make: string => t = "Dog";
  /* Need this to ensure correct usage in other modules */
  let make = make;

  [@bs.send] external speak: t => unit = "";
};

let spot = Animal_Dog.make("Spot");
Animal_Dog.speak(spot);




























[%%bs.raw {|

// Dummy class for example:
class Animal {
  speak() {}
}

// or:
// import Animal from "somewhere";

class Dog extends Animal {
  _name;

  constructor(name) {
    super();
    this._name = name;
  }

  speak() {
    console.log(`${this._name} says woof!!`);
    super.speak();
  }
}
|}];