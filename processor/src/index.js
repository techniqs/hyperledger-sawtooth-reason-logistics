'use strict'
// entrypoint of processor 

const { TransactionProcessor } = require('sawtooth-sdk/processor')
const SupplyHandler = require('./js/SupplyHandler')

console.log("Processor started, not connected yet");

// address of validator 

// without docker should be this address
// const address = "tcp://localhost:4004";

const address = "tcp://172.17.0.1:4004";

const transactionProcessor = new TransactionProcessor(address)

// adding custom Handler
transactionProcessor.addHandler(new SupplyHandler())

transactionProcessor.start()

