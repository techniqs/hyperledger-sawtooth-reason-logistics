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
 * TransactionHandler is the interface that defines the business logic
 * for a new transaction family. This is the only interface that needs
 * to be implemented to create a new transaction family.
 *
 * The transactionFamilyName, versions, and namespaces properties are
 * used by the processor to route processing requests to the handler.
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TransactionHandler =
/*#__PURE__*/
function () {
  /**
   * @param {string} transactionFamilyName - the name of the
   * transaction family that this handler can process, e.g. "intkey"
   * @param {string[]} versions - the versions of the transaction
   * family that this handler can process, e.g. ["1.0", "1.5"]
   * @param {string[]} namespaces - a list containing all of the
   * handler's namespaces, e.g. ["abcdef"]
   */
  function TransactionHandler(transactionFamilyName, versions, namespaces) {
    _classCallCheck(this, TransactionHandler);

    _readOnlyProperty(this, 'transactionFamilyName', transactionFamilyName);

    _readOnlyProperty(this, 'versions', versions);

    _readOnlyProperty(this, 'namespaces', namespaces);
  }
  /**
   * Apply is the single method where all the business logic for a
   * transaction family is defined. The method will be called by the
   * transaction processor upon receiving a TpProcessRequest that the
   * handler understands and will pass in the TpProcessRequest and an
   * initialized instance of the Context type.
   *
   * @param {TpProcessRequest} transactionProcessRequest - the
   * transaction to be processed
   * @param {Context} context - the context the handler can use to
   * access state
   */


  _createClass(TransactionHandler, [{
    key: "apply",
    value: function apply(transactionProcessRequest, context) {
      throw new Error('apply(TpProcessRequest, context) not implemented');
    }
  }]);

  return TransactionHandler;
}();

var _readOnlyProperty = function _readOnlyProperty(instance, propertyName, value) {
  return Object.defineProperty(instance, propertyName, {
    writeable: false,
    enumerable: true,
    congigurable: true,
    value: value
  });
};

module.exports = {
  TransactionHandler: TransactionHandler
};