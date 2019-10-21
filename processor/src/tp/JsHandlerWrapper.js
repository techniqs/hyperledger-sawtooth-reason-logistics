'use strict';

const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { SupplyHandlerImpl } = require('./Handler.bs');


// there is no way to extend in ReasonMl, since it was designed as,
// we can control what happens in functions but extending we wont need
class SupplyHandler extends TransactionHandler {

    constructor() {
        // Namespace has to be a hash

        //xo super
        // super("xo", ["1.0"], ["5b7349"]);

        // education super
        super("simple_supply", ["0.1"], ["212bd8"]);    
    }

    apply(transactionProcessRequest, context) {
        console.log(SupplyHandlerImpl[1](this, transactionProcessRequest, context));

        // return SupplyHandlerImpl.apply(this, transactionProcessRequest, context);
    }
}

module.exports = SupplyHandler;
