'use strict';

const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { SupplyHandlerImpl } = require('../tp/Handler.bs');
const { nameSpace } = require('../utils/Address.bs');

// there is no way to extend in ReasonMl
class SupplyHandler extends TransactionHandler {

    constructor() {
        super("hyperledger-sawtooth-reason-logistics", ["0.1"], [nameSpace]);
    }

    apply(transactionProcessRequest, context) {
        return SupplyHandlerImpl.apply(this, transactionProcessRequest, context);
    }
}

module.exports = SupplyHandler;
