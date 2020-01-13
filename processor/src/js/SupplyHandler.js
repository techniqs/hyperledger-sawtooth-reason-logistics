'use strict';

const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { SupplyHandlerImpl } = require('../tp/Handler.bs');

// there is no way to extend in ReasonMl
class SupplyHandler extends TransactionHandler {

    constructor() {
        super("sawtooth-reason-supply", ["0.1"], ["5d347c"]);    
    }

    apply(transactionProcessRequest, context) {
        return SupplyHandlerImpl.apply(this, transactionProcessRequest, context);
    }
}

module.exports = SupplyHandler;
