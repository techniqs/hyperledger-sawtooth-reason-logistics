/**
 * Copyright 2017 Intel Corporation
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
/**
 * Thrown when trying to create a context for an algorithm which does not exist.
 */

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

var NoSuchAlgorithmError =
/*#__PURE__*/
function (_Error) {
  _inherits(NoSuchAlgorithmError, _Error);

  /**
   * Constructs a new NoSuchAlgorithmError
   *
   * @param {string} [message] - an optional message, defaults to the empty
   * string
   */
  function NoSuchAlgorithmError() {
    var _this;

    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, NoSuchAlgorithmError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NoSuchAlgorithmError).call(this, message));
    _this.name = _this.constructor.name;
    return _this;
  }

  return NoSuchAlgorithmError;
}(_wrapNativeSuper(Error));
/**
 * Thrown when an error occurs during the signing process.
 */


var SigningError =
/*#__PURE__*/
function (_Error2) {
  _inherits(SigningError, _Error2);

  /**
   * Constructs a new SigningError
   *
   * @param {string} [message] - an optional message, defaults to the empty
   * string
   */
  function SigningError() {
    var _this2;

    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, SigningError);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(SigningError).call(this, message));
    _this2.name = _this2.constructor.name;
    return _this2;
  }

  return SigningError;
}(_wrapNativeSuper(Error));
/**
 * Thrown when an error occurs during deserialization of a Private or Public
 * key from various formats.
 */


var ParseError =
/*#__PURE__*/
function (_Error3) {
  _inherits(ParseError, _Error3);

  /**
   * Constructs a new ParseError
   *
   * @param {string} [message] - an optional message, defaults to the empty
   * string
   */
  function ParseError() {
    var _this3;

    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, ParseError);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(ParseError).call(this, message));
    _this3.name = _this3.constructor.name;
    return _this3;
  }

  return ParseError;
}(_wrapNativeSuper(Error));
/**
 * A private key instance.
 *
 * The underlying content is dependent on implementation.
 */


var PrivateKey =
/*#__PURE__*/
function () {
  function PrivateKey() {
    _classCallCheck(this, PrivateKey);

    if (this.constructor === PrivateKey) {
      throw new TypeError('Cannot construct abstract class');
    }
  }
  /**
   * Returns the algorithm name used for this private key.
   */


  _createClass(PrivateKey, [{
    key: "getAlgorithmName",
    value: function getAlgorithmName() {
      throw new TypeError('Abstract method not implemented');
    }
    /**
     * Return the private key encoded as a hex string
     */

  }, {
    key: "asHex",
    value: function asHex() {
      return this.asBytes().toString('hex');
    }
    /**
     * Returns the private key bytes in a Buffer.
     */

  }, {
    key: "asBytes",
    value: function asBytes() {
      throw new TypeError('Abstract method not implemented');
    }
  }]);

  return PrivateKey;
}();
/**
 * A public key instance.
 *
 * The underlying content is dependent on implementation.
 */


var PublicKey =
/*#__PURE__*/
function () {
  function PublicKey() {
    _classCallCheck(this, PublicKey);

    if (this.constructor === PublicKey) {
      throw new TypeError('Cannot construct abstract class');
    }
  }
  /**
   * Returns the algorithm name used for this public key.
   */


  _createClass(PublicKey, [{
    key: "getAlgorithmName",
    value: function getAlgorithmName() {
      throw new TypeError('Abstract method not implemented');
    }
    /**
     * Return the public key encoded as a hex string
     */

  }, {
    key: "asHex",
    value: function asHex() {
      return this.asBytes().toString('hex');
    }
    /**
     * Returns the public key bytes in a Buffer.
     */

  }, {
    key: "asBytes",
    value: function asBytes() {
      throw new TypeError('Abstract method not implemented');
    }
  }]);

  return PublicKey;
}();
/**
 * A context for a cryptographic signing algorithm.
 */


var Context =
/*#__PURE__*/
function () {
  function Context() {
    _classCallCheck(this, Context);

    if (this.constructor === Context) {
      throw new TypeError('Cannot construct abstract class');
    }
  }
  /**
   * Returns the algorithm name used for this context.
   */


  _createClass(Context, [{
    key: "getAlgorithmName",
    value: function getAlgorithmName() {
      throw new TypeError('Abstract method not implemented');
    }
    /**
     * Sign a message.
     *
     * Given a private key for this algorithm, sign the given message bytes
     * and return a hex-encoded string of the resulting signature.
     *
     * @param {Buffer} message - the message bytes
     * @param {PrivateKey} privateKey - the private key
     *
     * @returns {string} - The signature in a hex-encoded string
     *
     * @throws {SigningError} - if any error occurs during the signing process
     */

  }, {
    key: "sign",
    value: function sign(message, privateKey) {
      throw new TypeError('Abstract method not implemented');
    }
    /**
     * Verifies that a signature of a message was produced with the associated
     * public key.
     *
     * @param {string} signature - the hex-encoded signature
     * @param {Buffer} message - the message bytes
     * @param {PublicKey} publicKey - the public key to use for verification
     *
     * @returns {boolean} - true if the public key is associated with the
     * signature for that method, false otherwise
     */

  }, {
    key: "verify",
    value: function verify(signature, message, publicKey) {
      throw new TypeError('Abstract method not implemented');
    }
    /**
     * Produce a public key for the given private key.
     *
     * @param {PrivateKey} privateKey - a private key
     *
     * @return {PublicKey} - the public key for the given private key
     */

  }, {
    key: "getPublicKey",
    value: function getPublicKey(privateKey) {
      throw new TypeError('Abstract method not implemented');
    }
    /**
     * Generate a new random private key, based on the underlying algorithm.
     *
     * @return {PrivateKey} - a private key instance
     */

  }, {
    key: "newRandomPrivateKey",
    value: function newRandomPrivateKey() {
      throw new TypeError('Abstract method not implemented');
    }
  }]);

  return Context;
}();

module.exports = {
  NoSuchAlgorithmError: NoSuchAlgorithmError,
  SigningError: SigningError,
  ParseError: ParseError,
  PublicKey: PublicKey,
  PrivateKey: PrivateKey,
  Context: Context
};