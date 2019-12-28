/**
 * Copyright 2017 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ------------------------------------------------------------------------------
 */
'use strict';

var assert = require('assert');

var _require = require('../../signing'),
    createContext = _require.createContext,
    CryptoFactory = _require.CryptoFactory,
    ParseError = _require.ParseError;

var _require2 = require('../../signing/secp256k1'),
    Secp256k1PrivateKey = _require2.Secp256k1PrivateKey,
    Secp256k1PublicKey = _require2.Secp256k1PublicKey;

var KEY1_PRIV_HEX = '2f1e7b7a130d7ba9da0068b3bb0ba1d79e7e77110302c9f746c3c2a63fe40088';
var KEY1_PUB_HEX = '026a2c795a9776f75464aa3bda3534c3154a6e91b357b1181d3f515110f84b67c5';
var KEY2_PRIV_HEX = '51b845c2cdde22fe646148f0b51eaf5feec8c82ee921d5e0cbe7619f3bb9c62d';
var KEY2_PUB_HEX = '039c20a66b4ec7995391dbec1d8bb0e2c6e6fd63cd259ed5b877cb4ea98858cf6d';
var MSG1 = 'test';
var MSG1_KEY1_SIG = '5195115d9be2547b720ee74c23dd841842875db6eae1f5da8605b050a49e' + '702b4aa83be72ab7e3cb20f17c657011b49f4c8632be2745ba4de79e6aa0' + '5da57b35';
var MSG2 = 'test2';
var MSG2_KEY2_SIG = 'd589c7b1fa5f8a4c5a389de80ae9582c2f7f2a5e21bab5450b670214e5b1' + 'c1235e9eb8102fd0ca690a8b42e2c406a682bd57f6daf6e142e5fa4b2c26' + 'ef40a490';
describe('Secp256k1', function () {
  describe('parsing', function () {
    it('should parse hex keys', function () {
      var privKey = Secp256k1PrivateKey.fromHex(KEY1_PRIV_HEX);
      assert.equal('secp256k1', privKey.getAlgorithmName());
      assert.equal(KEY1_PRIV_HEX, privKey.asHex());
      var pubKey = Secp256k1PublicKey.fromHex(KEY1_PUB_HEX);
      assert.equal('secp256k1', pubKey.getAlgorithmName());
      assert.equal(KEY1_PUB_HEX, pubKey.asHex());
    });
    it('should check invalid digits', function () {
      var privKeyChars = KEY1_PRIV_HEX.replace('1', 'i');
      assert["throws"](function () {
        Secp256k1PrivateKey.fromHex(privKeyChars);
      }, ParseError);
      var pubKeyChars = KEY1_PUB_HEX.replace('1', 'i');
      assert["throws"](function () {
        Secp256k1PublicKey.fromHex(pubKeyChars);
      }, ParseError);
    });
  });
  describe('private to public', function () {
    it('should return the correct public key', function () {
      var context = createContext('secp256k1');
      assert.equal('secp256k1', context.getAlgorithmName());
      var privKey1 = Secp256k1PrivateKey.fromHex(KEY1_PRIV_HEX);
      assert.equal(KEY1_PRIV_HEX, privKey1.asHex());
      var publicKey1 = context.getPublicKey(privKey1);
      assert.equal(KEY1_PUB_HEX, publicKey1.asHex());
      var privKey2 = Secp256k1PrivateKey.fromHex(KEY2_PRIV_HEX);
      assert.equal(KEY2_PRIV_HEX, privKey2.asHex());
      var publicKey2 = context.getPublicKey(privKey2);
      assert.equal(KEY2_PUB_HEX, publicKey2.asHex());
    });
  });
  describe('signing', function () {
    it('should correcly produce a signature', function () {
      var context = createContext('secp256k1');
      var factory = new CryptoFactory(context);
      assert.equal('secp256k1', factory.getContext().getAlgorithmName());
      var privKey = Secp256k1PrivateKey.fromHex(KEY1_PRIV_HEX);
      var signer = factory.newSigner(privKey);
      var signature = signer.sign(Buffer.from(MSG1));
      assert.equal(MSG1_KEY1_SIG, signature);
    });
    it('should correctly produce multiple signatures', function () {
      var context = createContext('secp256k1');
      var privKey1 = Secp256k1PrivateKey.fromHex(KEY1_PRIV_HEX);
      var privKey2 = Secp256k1PrivateKey.fromHex(KEY2_PRIV_HEX);
      var signature = context.sign(Buffer.from(MSG1), privKey1);
      assert.equal(signature, MSG1_KEY1_SIG);
      signature = context.sign(Buffer.from(MSG2), privKey2);
      assert.equal(signature, MSG2_KEY2_SIG);
    });
  });
  describe('verification', function () {
    it('should succeed on correct public key', function () {
      var context = createContext('secp256k1');
      var pubKey1 = Secp256k1PublicKey.fromHex(KEY1_PUB_HEX);
      assert.equal(pubKey1.getAlgorithmName(), 'secp256k1');
      assert.equal(pubKey1.asHex(), KEY1_PUB_HEX);
      var result = context.verify(MSG1_KEY1_SIG, Buffer.from(MSG1), pubKey1);
      assert.equal(result, true);
    });
    it('should fail on incorrect public key', function () {
      var context = createContext('secp256k1');
      var pubKey1 = Secp256k1PublicKey.fromHex(KEY1_PUB_HEX);
      assert.equal(pubKey1.getAlgorithmName(), 'secp256k1');
      assert.equal(pubKey1.asHex(), KEY1_PUB_HEX); // This signature doesn't match for MSG1/KEY1

      var result = context.verify(MSG2_KEY2_SIG, Buffer.from(MSG1), pubKey1);
      assert.equal(result, false);
    });
  });
});