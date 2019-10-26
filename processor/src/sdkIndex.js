'use strict'

const { TransactionProcessor } = require('sawtooth-sdk/processor')
const SupplyHandler = require('./tp/JsHandlerWrapper')

// npm run start tcp://localhost:4004
const address = "tcp://localhost:4004";

if (process.argv.length < 3) {
    console.log('Nothin specified, simple supply will be called!')

    const transactionProcessor = new TransactionProcessor(address)

    transactionProcessor.addHandler(new SupplyHandler())

    transactionProcessor.start()

} else {
    console.log('Got extra input, xo will be called!')

    const transactionProcessor = new TransactionProcessor(address)

    transactionProcessor.addHandler(new SupplyHandler("xo"))

    transactionProcessor.start()
}

