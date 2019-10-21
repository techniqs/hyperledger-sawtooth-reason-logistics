'use strict';

const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { SupplyHandlerImpl } = require('./Handler.bs');


// there is no way to extend in ReasonMl, since it was designed as,
// we can control what happens in functions but extending we wont need
class SupplyHandler extends TransactionHandler {

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
