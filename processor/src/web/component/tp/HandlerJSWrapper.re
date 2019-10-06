// https://github.com/sequelize/sequelize/issues/7840

// Error : Class constructor TransactionHandler cannot be invoked without 'new'
// probably some babel error .. 
[%%raw {|
    const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
    import * as Handler from "./Handler.bs";

    
    // export default class SupplyHandler extends TransactionHandler {

    export default class SupplyHandler {
      constructor () {
        // super("FAMILY", ["1.0"], ["NAMESPACE"]);
      }
      apply(transactionProcessRequest, context) {
        console.log("Dont forget to call apply from Handler");
        // return Handler.SupplyHandlerImpl[3](this, transactionProcessRequest, context);
      }
    }
    
    |}]