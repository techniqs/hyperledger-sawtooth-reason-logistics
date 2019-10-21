'use strict'

const { TransactionProcessor } = require('sawtooth-sdk/processor')
const SupplyHandler = require('./web/component/tp/HandlerJsWrapper')
const XoHandler = require('./web/component/tp/XOHandler')

// npm run start tcp://localhost:4004
const address = "tcp://localhost:4004";

const transactionProcessor = new TransactionProcessor(address)

transactionProcessor.addHandler(new SupplyHandler())
// transactionProcessor.addHandler(new XoHandler())

transactionProcessor.start()
