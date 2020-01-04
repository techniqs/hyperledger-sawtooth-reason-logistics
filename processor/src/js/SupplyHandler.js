'use strict';

const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { SupplyHandlerImpl } = require('../tp/Handler.bs');

// there is no way to extend in ReasonMl, since it was designed as,
// we can control what happens in functions but extending we wont need
class SupplyHandler extends TransactionHandler {
        // Namespace has to be a hash

    constructor() {
        // my_sawtooth super
        super("sawtooth-reason-supply", ["0.1"], ["5d347c"]);    
    }

    apply(transactionProcessRequest, context) {
        return SupplyHandlerImpl.apply(this, transactionProcessRequest, context);
    }
}

module.exports = SupplyHandler;
