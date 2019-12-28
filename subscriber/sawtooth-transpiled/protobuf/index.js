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

var protobuf = require('protobufjs');

var root = protobuf.Root.fromJSON(require('./protobuf_bundle.json'));
var Message = root.lookup('Message');
Message.MessageType = Message.nested.MessageType.values;

Message.MessageType.stringValue = function (id) {
  return "".concat(Message.nested.MessageType.valuesById[id], "(").concat(id, ")");
};

var exportableMessages = Object.keys(root).filter(function (key) {
  return /^[A-Z]/.test(key);
}).reduce(function (acc, key) {
  acc[key] = root[key];
  return acc;
}, {}); // Add our stringValue enabled Message

exportableMessages['Message'] = Message;
module.exports = exportableMessages;