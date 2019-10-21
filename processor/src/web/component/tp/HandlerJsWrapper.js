'use strict';

const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { SupplyHandlerImpl } = require('./Handler.bs');


// TODO change back to extends..
// this for node
class SupplyHandler extends TransactionHandler {

    // this idk 
    // export default class SupplyHandler extends TransactionHandler {

    // this for razzle
    // export default class SupplyHandler {

    constructor() {
        // Namespace has to be a hash
        super("xo", ["1.0"], ["5b7349"]);
    }

    apply(transactionProcessRequest, context) {
        console.log(SupplyHandlerImpl[5](this, transactionProcessRequest, context));

        // return SupplyHandlerImpl.apply(this, transactionProcessRequest, context);
    }
}

module.exports = SupplyHandler;
