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

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('../protobuf'),
    TpStateEntry = _require.TpStateEntry,
    TpStateGetRequest = _require.TpStateGetRequest,
    TpStateGetResponse = _require.TpStateGetResponse,
    TpStateSetRequest = _require.TpStateSetRequest,
    TpStateSetResponse = _require.TpStateSetResponse,
    TpStateDeleteRequest = _require.TpStateDeleteRequest,
    TpStateDeleteResponse = _require.TpStateDeleteResponse,
    TpReceiptAddDataRequest = _require.TpReceiptAddDataRequest,
    TpReceiptAddDataResponse = _require.TpReceiptAddDataResponse,
    Event = _require.Event,
    TpEventAddRequest = _require.TpEventAddRequest,
    TpEventAddResponse = _require.TpEventAddResponse,
    Message = _require.Message;

var _require2 = require('../processor/exceptions'),
    AuthorizationException = _require2.AuthorizationException,
    InternalError = _require2.InternalError;

var _timeoutPromise = function _timeoutPromise(p, millis) {
  if (millis !== null && millis !== undefined) {
    return Promise.race([new Promise(function (resolve, reject) {
      return setTimeout(function () {
        return reject(Error('Timeout occurred'));
      }, millis);
    }), p]);
  } else {
    return p;
  }
};
/**
 * Context provides an interface for getting and setting validator
 * state. All validator interactions by a handler should be through
 * a Context instance.
 */


var Context =
/*#__PURE__*/
function () {
  function Context(stream, contextId) {
    _classCallCheck(this, Context);

    this._stream = stream;
    this._contextId = contextId;
  }
  /**
   * getState queries the validator state for data at each of the
   * addresses in the given list. The addresses that have been set are
   * returned in a list.
   *
   * @param {string[]} addresses an array of addresses
   * @param {number} [timeout] - an optional timeout
   * @return a promise for a map of (address, buffer) pairs, where the
   * buffer is the encoded value at the specified address
   * @throws {AuthorizationException}
   */


  _createClass(Context, [{
    key: "getState",
    value: function getState(addresses) {
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var getRequest = TpStateGetRequest.create({
        addresses: addresses,
        contextId: this._contextId
      });

      var future = this._stream.send(Message.MessageType.TP_STATE_GET_REQUEST, TpStateGetRequest.encode(getRequest).finish());

      return _timeoutPromise(future.then(function (buffer) {
        var getResponse = TpStateGetResponse.decode(buffer);
        var results = {};
        getResponse.entries.forEach(function (entry) {
          results[entry.address] = entry.data;
        });

        if (getResponse.status === TpStateGetResponse.Status.AUTHORIZATION_ERROR) {
          throw new AuthorizationException("Tried to get unauthorized address ".concat(addresses));
        }

        return results;
      }), timeout);
    }
    /**
     * setState requests that each address in the provided dictionary
     * be set in validator state to its corresponding value. A list is
     * returned containing the successfully set addresses.
      * @param {Object} addressValuePairs - a map of (address, buffer)
     * entries, where the buffer is the encoded value to be set at the
     * the given address.
     * @param {number} [timeout] - an optional timeout
     * @return a promise for the adddresses successfully set.
     * @throws {AuthorizationException}
     */

  }, {
    key: "setState",
    value: function setState(addressValuePairs) {
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var entries = Object.keys(addressValuePairs).map(function (address) {
        return TpStateEntry.create({
          address: address,
          data: addressValuePairs[address]
        });
      });
      var setRequest = TpStateSetRequest.create({
        entries: entries,
        contextId: this._contextId
      });

      var future = this._stream.send(Message.MessageType.TP_STATE_SET_REQUEST, TpStateSetRequest.encode(setRequest).finish());

      return _timeoutPromise(future.then(function (buffer) {
        var setResponse = TpStateSetResponse.decode(buffer);

        if (setResponse.status === TpStateSetResponse.Status.AUTHORIZATION_ERROR) {
          var addresses = Object.keys(addressValuePairs);
          throw new AuthorizationException("Tried to set unauthorized address ".concat(addresses));
        }

        return setResponse.addresses;
      }), timeout);
    }
    /**
     * deleteState requests that each of the provided addresses be
     * unset in validator state. A list of successfully deleted
     * addresses is returned.
     *
     * @param {string[]} addresses -  an array of addresses
     * @param {number} [timeout] - an optional timeout
     * @return a promise for the adddresses successfully deleted.
     * @throws {AuthorizationException}
     */

  }, {
    key: "deleteState",
    value: function deleteState(addresses) {
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var getRequest = TpStateDeleteRequest.create({
        addresses: addresses,
        contextId: this._contextId
      });

      var future = this._stream.send(Message.MessageType.TP_STATE_DELETE_REQUEST, TpStateDeleteRequest.encode(getRequest).finish());

      return _timeoutPromise(future.then(function (buffer) {
        var deleteResponse = TpStateDeleteResponse.decode(buffer);

        if (deleteResponse.status === TpStateDeleteResponse.Status.AUTHORIZATION_ERROR) {
          throw new AuthorizationException("Tried to delete unauthorized address ".concat(addresses));
        }

        return deleteResponse.addresses;
      }), timeout);
    }
    /**
     * Add a blob to the execution result for this transaction.
     *
     * @param {Buffer} data - the data to add
     * @param {number} [timeout] - an optional timeout
     * @return {Promise} a promise that resolves to nothing on success, or an
     * error if the operation fails
     */

  }, {
    key: "addReceiptData",
    value: function addReceiptData(data) {
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var addReceiptRequest = TpReceiptAddDataRequest.create({
        contextId: this._contextId,
        data: data
      });

      var future = this._stream.send(Message.MessageType.TP_RECEIPT_ADD_DATA_REQUEST, TpReceiptAddDataRequest.encode(addReceiptRequest).finish());

      return _timeoutPromise(future.then(function (buffer) {
        var response = TpReceiptAddDataResponse.decode(buffer);

        if (response.status !== TpReceiptAddDataResponse.Status.OK) {
          throw new InternalError('Failed to add receipt data');
        }
      }), timeout);
    }
    /**
     * Add a new event to the execution result for this transaction.
     *
     * @param {string} eventType - This is used to subscribe to events. It should
     * be globally unique and describe what, in general, has occurred
     * @param {string[][]} attributes - Additional information about the event that
     * is transparent to the validator.  Attributes can be used by subscribers to
     * filter the type of events they receive.
     * @param {Buffer} data - Additional information about the event that is
     * opaque to the validator.
     * @param {number} [timeout] - an optional timeout
     * @return {Promise} a promise that resolves to nothing on success, or an
     * error if the operation fails
     */

  }, {
    key: "addEvent",
    value: function addEvent(eventType, attributes, data) {
      var timeout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      if (attributes === null || attributes === undefined) {
        attributes = [];
      }

      var event = Event.create({
        eventType: eventType,
        attributes: attributes.map(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0],
              value = _ref2[1];

          return Event.Attribute.create({
            key: key,
            value: value
          });
        }),
        data: data
      });
      var request = TpEventAddRequest.encode({
        contextId: this._contextId,
        event: event
      }).finish();

      var future = this._stream.send(Message.MessageType.TP_EVENT_ADD_REQUEST, request);

      return _timeoutPromise(future.then(function (buffer) {
        var response = TpEventAddResponse.decode(buffer);

        if (response.status !== TpEventAddResponse.Status.OK) {
          throw new InternalError("Failed to add event: ".concat(eventType));
        }
      }), timeout);
    }
  }]);

  return Context;
}();

module.exports = Context;