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

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var crypto = require('crypto');

var uuid = require('uuid/v4');

var zmq = require('zeromq');

var assert = require('assert');

var _require = require('../protobuf'),
    Message = _require.Message;

var Deferred = require('./deferred');

var _require2 = require('../processor/exceptions'),
    ValidatorConnectionError = _require2.ValidatorConnectionError;

var _encodeMessage = function _encodeMessage(messageType, correlationId, content) {
  assert(typeof messageType === 'number', "messageType must be a number; was ".concat(messageType));
  assert(typeof correlationId === 'string', "correlationId must be a string; was ".concat(correlationId));
  assert(content !== undefined || content !== null, 'content must not be null or undefined');
  assert(Buffer.isBuffer(content), "content must be a buffer; was ".concat(content.constructor ? content.constructor.name : _typeof(content)));
  return Message.encode({
    messageType: messageType,
    correlationId: correlationId,
    content: content
  }).finish();
};

var _generateId = function _generateId() {
  return crypto.createHash('sha256').update(uuid()).digest('hex');
};

var Stream =
/*#__PURE__*/
function () {
  function Stream(url) {
    _classCallCheck(this, Stream);

    this._url = url;
    this._initial_connection = true;
  }

  _createClass(Stream, [{
    key: "connect",
    value: function connect(onConnectCb) {
      var _this = this;

      if (this._onConnectCb) {
        console.log("Attempting to reconnect to ".concat(this._url));
      }

      this._onConnectCb = onConnectCb;
      this._futures = {};
      this._socket = zmq.socket('dealer');

      this._socket.setsockopt('identity', Buffer.from(uuid(), 'utf8'));

      this._socket.on('connect', function () {
        console.log("Connected to ".concat(_this._url));
        onConnectCb();
      });

      this._socket.on('disconnect', function (fd, endpoint) {
        return _this._handleDisconnect();
      });

      this._socket.monitor(250, 0);

      this._socket.connect(this._url);

      this._initial_connection = false;
    }
  }, {
    key: "close",
    value: function close() {
      this._socket.setsockopt(zmq.ZMQ_LINGER, 0);

      this._socket.unmonitor();

      this._socket.close();

      this._socket = null;
    }
  }, {
    key: "_handleDisconnect",
    value: function _handleDisconnect() {
      var _this2 = this;

      console.log("Disconnected from ".concat(this._url));
      this.close();
      Object.keys(this._futures).forEach(function (correlationId) {
        _this2._futures[correlationId].reject(new ValidatorConnectionError('The connection to the validator was lost'));
      });
      this.connect(this._onConnectCb);
    }
  }, {
    key: "send",
    value: function send(type, content) {
      var _this3 = this;

      if (this._socket) {
        var correlationId = _generateId();

        var deferred = new Deferred();
        this._futures[correlationId] = deferred;

        try {
          this._socket.send(_encodeMessage(type, correlationId, content));
        } catch (e) {
          delete this._futures[correlationId];
          return Promise.reject(e);
        }

        return deferred.promise.then(function (result) {
          delete _this3._futures[correlationId];
          return result;
        })["catch"](function (err) {
          delete _this3._futures[correlationId];
          throw err;
        });
      } else {
        var err = null;

        if (this._initial_connection) {
          err = new Error('Must call `connect` before calling `send`');
        } else {
          err = new ValidatorConnectionError('The connection to the validator was lost');
        }

        return Promise.reject(err);
      }
    }
  }, {
    key: "sendBack",
    value: function sendBack(type, correlationId, content) {
      if (this._socket) {
        this._socket.send(_encodeMessage(type, correlationId, content));
      }
    }
  }, {
    key: "onReceive",
    value: function onReceive(cb) {
      var _this4 = this;

      console.log("onReceive called");

      this._socket.on('message', function (buffer) {
        console.log("BUFFER HERE");
        var message = Message.decode(buffer);

        if (_this4._futures[message.correlationId]) {
          _this4._futures[message.correlationId].resolve(message.content);
        } else {
          process.nextTick(function () {
            return cb(message);
          });
        }
      });
    }
  }]);

  return Stream;
}();

module.exports = {
  Stream: Stream
};