'use strict';

const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { SupplyHandlerImpl } = require('../tp/Handler.bs');
const { nameSpace } = require('../utils/Address.bs');

// there is no way to extend in ReasonMl
class SupplyHandler extends TransactionHandler {

    constructor() {
        // specifies which transaction requests my processor accepts 
        super("hyperledger-sawtooth-reason-logistics", ["0.1"], [nameSpace]);
    }

    apply(transactionProcessRequest, context) {
        // calling my Reason Implementation of the SupplyHandler
        return SupplyHandlerImpl.apply(this, transactionProcessRequest, context);
    }
}

module.exports = SupplyHandler;
