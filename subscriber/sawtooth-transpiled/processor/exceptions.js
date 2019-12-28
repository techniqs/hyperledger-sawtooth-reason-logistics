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

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _TransactionProcessorError =
/*#__PURE__*/
function (_Error) {
  _inherits(_TransactionProcessorError, _Error);

  function _TransactionProcessorError() {
    var _this;

    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var extendedData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, _TransactionProcessorError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(_TransactionProcessorError).call(this, message));
    _this.name = _this.constructor.name;

    if (extendedData) {
      if (Buffer.isBuffer(extendedData) || extendedData instanceof Uint8Array) {
        _this.extendedData = extendedData;
      } else {
        throw new TypeError('extendedData must be a Buffer or a Uint8Array');
      }
    }

    return _this;
  }

  return _TransactionProcessorError;
}(_wrapNativeSuper(Error));
/**
 * Thrown for an Invalid Transaction.
 */


var InvalidTransaction =
/*#__PURE__*/
function (_TransactionProcessor) {
  _inherits(InvalidTransaction, _TransactionProcessor);

  /**
   * Constructs a new InvalidTransaction.
   *
   * @param {string} [message] - an optional message, defaults to the empty
   * string
   * @param {Buffer|Uint8Array} [extendedData] - optional, application-specific
   * serialized data to returned to the transaction submitter.
   */
  function InvalidTransaction(message, extendedData) {
    var _this2;

    _classCallCheck(this, InvalidTransaction);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(InvalidTransaction).call(this, message, extendedData));
    _this2.name = _this2.constructor.name;
    return _this2;
  }

  return InvalidTransaction;
}(_TransactionProcessorError);
/**
 * Thrown when an internal error occurs during transaction processing.
 */


var InternalError =
/*#__PURE__*/
function (_TransactionProcessor2) {
  _inherits(InternalError, _TransactionProcessor2);

  /**
   * Constructs a new InternalError
   * @param {string} [message] - an optional message, defaults to the empty
   * string
   * @param {Buffer|Uint8Array} [extendedData] - optional, application-specific
   * serialized data to returned to the transaction submitter.
   */
  function InternalError(message, extendedData) {
    var _this3;

    _classCallCheck(this, InternalError);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(InternalError).call(this, message, extendedData));
    _this3.name = _this3.constructor.name;
    return _this3;
  }

  return InternalError;
}(_TransactionProcessorError);
/**
 * Thrown when a connection error occurs between the validator and the
 * transaction processor.
 */


var ValidatorConnectionError =
/*#__PURE__*/
function (_Error2) {
  _inherits(ValidatorConnectionError, _Error2);

  /**
   * Construcs a new ValidatorConnectionError
   *
   * @param {string} [message] - an optional message, defaults to the empty
   * string
   */
  function ValidatorConnectionError() {
    var _this4;

    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, ValidatorConnectionError);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(ValidatorConnectionError).call(this, message));
    _this4.name = _this4.constructor.name;
    return _this4;
  }

  return ValidatorConnectionError;
}(_wrapNativeSuper(Error));
/**
 * Thrown when a authorization error occurs.
 */


var AuthorizationException =
/*#__PURE__*/
function (_Error3) {
  _inherits(AuthorizationException, _Error3);

  /**
   * Construcs a new AuthorizationException
   *
   * @param {string} [message] - an optional message, defaults to the empty
   * string
   */
  function AuthorizationException() {
    var _this5;

    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, AuthorizationException);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(AuthorizationException).call(this, message));
    _this5.name = _this5.constructor.name;
    return _this5;
  }

  return AuthorizationException;
}(_wrapNativeSuper(Error));

module.exports = {
  InvalidTransaction: InvalidTransaction,
  InternalError: InternalError,
  ValidatorConnectionError: ValidatorConnectionError,
  AuthorizationException: AuthorizationException
};