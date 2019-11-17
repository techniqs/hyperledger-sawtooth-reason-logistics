class type _invalidTransaction =
  [@bs]
  {
  };

type invalidTransaction = Js.t(_invalidTransaction);

// exception InvalidTransaction;

[@bs.new] [@bs.module "sawtooth-sdk/processor/exceptions"]
 external newInvalidTransaction: string => invalidTransaction = "InvalidTransaction";

// exception Invalid_Transaction(string);

//  exception InputClosed(string);

//  raise(InputClosed("xDD"));