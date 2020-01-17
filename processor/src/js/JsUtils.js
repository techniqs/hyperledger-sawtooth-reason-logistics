'use strict';

//defining exceptions

const {
    InvalidTransaction,
    InternalError
} = require('sawtooth-sdk/processor/exceptions')

module.exports.newInvalidTransactionException = function (error) {
    throw new InvalidTransaction(error);
}

module.exports.newInternalErrorException = function (error) {
    throw new InternalError(error);
}
