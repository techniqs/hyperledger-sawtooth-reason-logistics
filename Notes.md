some mindmap
need to extend transactionhandler and also ovverride apply function
problem is extending and overriding

cant just define own module because my TransactionProcessor.addHandler
only takes type TransactionHandler so need to extend it!!

maybe i can just override the apply function ?? 
just a good old external and then call my own letfunction
https://github.com/glennsl/bucklescript-cookbook#bind-to-a-higher-order-function-that-takes-a-function-accepting-an-argument-of-several-different-types-an-untagged-union

apply doesnt work yet.. 
in Try.bs.js 
 function test(param) {
  const x = new ctor("xo", /* array */["versions"], /* array */["namespaces"]);
  console.log("ARE YOU ?",x.prototype instanceof Handler.TransactionHandler);
  console.log("LOL WHICH TYPE?",x.constructor.name);
  return new ctor("xo", /* array */["versions"], /* array */["namespaces"]);

}

this says its constructor is TransactionHandler so it should be fine i guess.

check with this dude on Dev maybe he knows something about apply method overriding.
