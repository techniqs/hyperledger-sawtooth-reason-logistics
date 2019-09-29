// Bind to the superclass constructor function
// not sure if need tho
[@bs.module "sawtooth-sdk/processor/handler"] external super: _ = "TransactionHandler";
// [@bs.module "./handler.js"] external super: _ = "TransactionHandler";

let transactionFamilyNameField = "transactionFamilyName";
let versionsField = "versions";
let namespacesField = "namespaces";

// Create our class's constructor function
let ctor(transactionFamilyName, versions, namespaces) = {
  open Class;

  // Equivalent to `this.versions = versions;`
  setField(this, transactionFamilyNameField, transactionFamilyName);
  setField(this, versionsField, versions);
  setField(this, namespacesField, namespaces);
};

// Does the prototypal inheritance
Class.(extend(~ctor, ~super, [

  // Equivalent to `ctor.getVersions = function() { return this.versions; };`
  ("getTransactionFamilyName", [@bs.this] field(_, transactionFamilyNameField)),
  ("getVersions", [@bs.this] field(_, versionsField)),
  ("getNamespaces", [@bs.this] field(_, namespacesField)),
]));

// We still need to bind to the inherited class from BuckleScript

type t;

type any;

type void;

[@bs.new] external make: (string, array(string),array(string)) => t = "ctor";
// [@bs.new] external make: (int, string) => t = "ctor";

// i dont think overriding works
// [@bs.send] external apply: t => (any, any) = "";

// let apply()

let test() = make("xo",[|"versions"|],[|"namespaces"|]);
// let test() = "Bob" |> make(1) |> toString |> Js.log;
// Test in node with: `require('./src/Employee.bs.js').test()`