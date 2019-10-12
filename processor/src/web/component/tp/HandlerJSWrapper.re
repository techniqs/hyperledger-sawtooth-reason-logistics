[%%raw {|
    const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
    const { Handler } = require('./Handler.bs');

    
    // TODO change back to extends..
    // export default class SupplyHandler extends TransactionHandler {
    //  class SupplyHandler extends TransactionHandler {

    export default class SupplyHandler {
      constructor () {
        // super("FAMILY", ["1.0"], ["NAMESPACE"]);
      }
      apply(transactionProcessRequest, context) {
        // console.log("Dont forget to call apply from Handler");
        // return Handler.SupplyHandlerImpl[3](this, transactionProcessRequest, context);
      }
    }

    |}]