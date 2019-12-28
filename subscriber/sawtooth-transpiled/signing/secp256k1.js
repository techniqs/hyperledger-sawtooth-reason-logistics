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

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var secp256k1 = require('secp256k1');

var _require = require('crypto'),
    createHash = _require.createHash,
    randomBytes = _require.randomBytes;

var _require2 = require('./core'),
    PrivateKey = _require2.PrivateKey,
    PublicKey = _require2.PublicKey,
    Context = _require2.Context,
    ParseError = _require2.ParseError;

var Secp256k1PrivateKey =
/*#__PURE__*/
function (_PrivateKey) {
  _inherits(Secp256k1PrivateKey, _PrivateKey);

  /**
   * @param {Buffer} privateKeyBytes - the bytes of the private key
   */
  function Secp256k1PrivateKey(privateKeyBytes) {
    var _this;

    _classCallCheck(this, Secp256k1PrivateKey);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Secp256k1PrivateKey).call(this));
    _this.privateKeyBytes = privateKeyBytes;
    return _this;
  }

  _createClass(Secp256k1PrivateKey, [{
    key: "getAlgorithmName",
    value: function getAlgorithmName() {
      return 'secp256k1';
    }
    /**
     * @return {Buffer} the key in bytes
     */

  }, {
    key: "asBytes",
    value: function asBytes() {
      return Buffer.from(this.privateKeyBytes);
    }
    /**
     * Creates a private key from a hex encode set of bytes.
     *
     * @param {string} privateKeyHex - the key in hex
     * @return {PrivateKey} a private key instance
     * @throws {ParseError} if the private key is not valid
     */

  }], [{
    key: "fromHex",
    value: function fromHex(privateKeyHex) {
      var buffer = Buffer.from(privateKeyHex, 'hex'); // verify that it is either a proper compressed or uncompressed key

      if (!secp256k1.privateKeyVerify(buffer) && !secp256k1.privateKeyVerify(buffer, false)) {
        throw new ParseError('Unable to parse a private key from the given hex');
      }

      return new Secp256k1PrivateKey(buffer);
    }
  }, {
    key: "newRandom",
    value: function newRandom() {
      var privKey;

      do {
        privKey = randomBytes(32);
      } while (!secp256k1.privateKeyVerify(privKey));

      return new Secp256k1PrivateKey(privKey);
    }
  }]);

  return Secp256k1PrivateKey;
}(PrivateKey);

var Secp256k1PublicKey =
/*#__PURE__*/
function (_PublicKey) {
  _inherits(Secp256k1PublicKey, _PublicKey);

  function Secp256k1PublicKey(publicKeyBytes) {
    var _this2;

    _classCallCheck(this, Secp256k1PublicKey);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Secp256k1PublicKey).call(this));
    _this2.publicKeyBytes = publicKeyBytes;
    return _this2;
  }

  _createClass(Secp256k1PublicKey, [{
    key: "getAlgorithmName",
    value: function getAlgorithmName() {
      return 'secp256k1';
    }
    /**
     * @return {Buffer} the key in bytes
     */

  }, {
    key: "asBytes",
    value: function asBytes() {
      return Buffer.from(this.publicKeyBytes);
    }
    /**
     * Creates a public key from a hex encode set of bytes.
     *
     * @param {string} publicKeyHex - the key in hex
     * @return {PublicKey} a public key instance
     * @throws {ParseError} if the public key is not valid
     */

  }], [{
    key: "fromHex",
    value: function fromHex(publicKeyHex) {
      var buffer = Buffer.from(publicKeyHex, 'hex');

      if (!secp256k1.publicKeyVerify(buffer)) {
        throw new ParseError('Unable to parse a private key from the given hex');
      }

      return new Secp256k1PublicKey(buffer);
    }
  }]);

  return Secp256k1PublicKey;
}(PublicKey);

var Secp256k1Context =
/*#__PURE__*/
function (_Context) {
  _inherits(Secp256k1Context, _Context);

  function Secp256k1Context() {
    _classCallCheck(this, Secp256k1Context);

    return _possibleConstructorReturn(this, _getPrototypeOf(Secp256k1Context).apply(this, arguments));
  }

  _createClass(Secp256k1Context, [{
    key: "getAlgorithmName",
    value: function getAlgorithmName() {
      return 'secp256k1';
    }
  }, {
    key: "verify",
    value: function verify(signature, message, publicKey) {
      var dataHash = createHash('sha256').update(message).digest();
      var sigBytes = Buffer.from(signature, 'hex');
      return secp256k1.verify(dataHash, sigBytes, publicKey.publicKeyBytes);
    }
  }, {
    key: "sign",
    value: function sign(message, privateKey) {
      var dataHash = createHash('sha256').update(message).digest();
      var result = secp256k1.sign(dataHash, privateKey.privateKeyBytes);
      return result.signature.toString('hex');
    }
  }, {
    key: "getPublicKey",
    value: function getPublicKey(privateKey) {
      return new Secp256k1PublicKey(secp256k1.publicKeyCreate(privateKey.privateKeyBytes));
    }
  }, {
    key: "newRandomPrivateKey",
    value: function newRandomPrivateKey() {
      return Secp256k1PrivateKey.newRandom();
    }
  }]);

  return Secp256k1Context;
}(Context);

module.exports = {
  Secp256k1PrivateKey: Secp256k1PrivateKey,
  Secp256k1PublicKey: Secp256k1PublicKey,
  Secp256k1Context: Secp256k1Context
};