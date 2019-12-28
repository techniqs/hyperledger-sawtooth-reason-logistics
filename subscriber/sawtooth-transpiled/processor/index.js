/**
 * Copyright 2016 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ------------------------------------------------------------------------------
 */
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('../protobuf'),
    TpRegisterRequest = _require.TpRegisterRequest,
    TpRegisterResponse = _require.TpRegisterResponse,
    TpUnregisterRequest = _require.TpUnregisterRequest,
    TpProcessRequest = _require.TpProcessRequest,
    TpProcessResponse = _require.TpProcessResponse,
    PingResponse = _require.PingResponse,
    Message = _require.Message;

var _require2 = require('./exceptions'),
    InternalError = _require2.InternalError,
    AuthorizationException = _require2.AuthorizationException,
    InvalidTransaction = _require2.InvalidTransaction,
    ValidatorConnectionError = _require2.ValidatorConnectionError;

var Context = require('./context');

var _require3 = require('../messaging/stream'),
    Stream = _require3.Stream;
/**
 * TransactionProcessor is a generic class for communicating with a
 * validator and routing transaction processing requests to a
 * registered handler. It uses ZMQ and channels to handle requests
 * concurrently.
 *
 * @param {string} url - the URL of the validator
 */


var TransactionProcessor =
/*#__PURE__*/
function () {
  function TransactionProcessor(url) {
    _classCallCheck(this, TransactionProcessor);

    this._stream = new Stream(url);
    this._handlers = [];
  }
  /**
   * addHandler adds the given handler to the transaction processor so
   * it can receive transaction processing requests. All handlers must
   * be added prior to starting the processor.
   *
   * @param {TransactionHandler} handler - a handler to be added
   */


  _createClass(TransactionProcessor, [{
    key: "addHandler",
    value: function addHandler(handler) {
      this._handlers.push(handler);
    }
    /**
     * start connects the transaction processor to a validator and
     * starts listening for requests and routing them to an appropriate
     * handler.
     */

  }, {
    key: "start",
    value: function start() {
      var _this = this;

      this._stream.connect(function () {
        _this._stream.onReceive(function (message) {
          if (message.messageType !== Message.MessageType.TP_PROCESS_REQUEST) {
            if (message.messageType === Message.MessageType.PING_REQUEST) {
              console.log("Received Ping");
              var pingResponse = PingResponse.create();

              _this._stream.sendBack(Message.MessageType.PING_RESPONSE, message.correlationId, PingResponse.encode(pingResponse).finish());

              return;
            }

            console.log("Ignoring ".concat(Message.MessageType.stringValue(message.messageType)));
            return;
          }

          var request = TpProcessRequest.toObject(TpProcessRequest.decode(message.content), {
            defaults: false
          });
          var context = new Context(_this._stream, request.contextId);

          if (_this._handlers.length > 0) {
            var txnHeader = request.header;

            var handler = _this._handlers.find(function (candidate) {
              return candidate.transactionFamilyName === txnHeader.familyName && candidate.versions.includes(txnHeader.familyVersion);
            });

            if (handler) {
              var applyPromise;

              try {
                applyPromise = Promise.resolve(handler.apply(request, context));
              } catch (err) {
                applyPromise = Promise.reject(err);
              }

              applyPromise.then(function () {
                return TpProcessResponse.create({
                  status: TpProcessResponse.Status.OK
                });
              })["catch"](function (e) {
                if (e instanceof InvalidTransaction) {
                  console.log(e);
                  return TpProcessResponse.create({
                    status: TpProcessResponse.Status.INVALID_TRANSACTION,
                    message: e.message,
                    extendedData: e.extendedData
                  });
                } else if (e instanceof InternalError) {
                  console.log('Internal Error Occurred', e);
                  return TpProcessResponse.create({
                    status: TpProcessResponse.Status.INTERNAL_ERROR,
                    message: e.message,
                    extendedData: e.extendedData
                  });
                } else if (e instanceof ValidatorConnectionError) {
                  console.log('Validator disconnected.  Ignoring.');
                } else if (e instanceof AuthorizationException) {
                  console.log(e);
                  return TpProcessResponse.create({
                    status: TpProcessResponse.Status.INVALID_TRANSACTION,
                    message: e.message,
                    extendedData: e.extendedData
                  });
                } else {
                  console.log('Unhandled exception, returning INTERNAL_ERROR', e);
                  return TpProcessResponse.create({
                    status: TpProcessResponse.Status.INTERNAL_ERROR,
                    message: "Unhandled exception in ".concat(txnHeader.familyName, " ").concat(txnHeader.familyVersion)
                  });
                }
              }).then(function (response) {
                if (response) {
                  _this._stream.sendBack(Message.MessageType.TP_PROCESS_RESPONSE, message.correlationId, TpProcessResponse.encode(response).finish());
                }
              })["catch"](function (e) {
                return console.log('Unhandled error on sendBack', e);
              });
            }
          }
        });

        _this._handlers.forEach(function (handler) {
          handler.versions.forEach(function (version) {
            _this._stream.send(Message.MessageType.TP_REGISTER_REQUEST, TpRegisterRequest.encode({
              family: handler.transactionFamilyName,
              version: version,
              namespaces: handler.namespaces
            }).finish()).then(function (content) {
              return TpRegisterResponse.decode(content);
            }).then(function (ack) {
              var familyName = handler.transactionFamilyName;
              var status = ack.status === TpRegisterResponse.Status.OK ? 'succeeded' : 'failed';
              console.log("Registration of [".concat(familyName, " ").concat(version, "] ").concat(status));
            })["catch"](function (e) {
              var familyName = handler.transactionFamilyName;
              console.log("Registration of [".concat(familyName, " ").concat(version, "] Failed!"), e);
            });
          });
        });
      });

      process.on('SIGINT', function () {
        return _this._handleShutdown();
      });
      process.on('SIGTERM', function () {
        return _this._handleShutdown();
      });
    }
  }, {
    key: "_handleShutdown",
    value: function _handleShutdown() {
      console.log('Unregistering transaction processor');

      this._stream.send(Message.MessageType.TP_UNREGISTER_REQUEST, TpUnregisterRequest.encode().finish());

      process.exit();
    }
  }]);

  return TransactionProcessor;
}();

module.exports = {
  TransactionProcessor: TransactionProcessor
};