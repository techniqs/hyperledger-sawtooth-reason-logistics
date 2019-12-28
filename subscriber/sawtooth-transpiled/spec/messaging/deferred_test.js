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

var assert = require('assert');

var Deferred = require('../../messaging/deferred');

describe('Deferred', function () {
  describe('resolve', function () {
    it('should immediately return the value of a resolved deferred', function () {
      var deferred = new Deferred();
      deferred.resolve('my result');
      return deferred.promise.then(function (result) {
        assert.equal('my result', result);
      });
    });
    it('should not return until resolved.', function () {
      var deferred = new Deferred();
      var promise = deferred.promise.then(function (result) {
        assert.equal('my result', result);
      });
      deferred.resolve('my result');
      return promise;
    });
  });
  describe('reject', function () {
    it('should return a undefined error when none is set', function (done) {
      var deferred = new Deferred();
      deferred.promise["catch"](function (e) {
        assert.equal(undefined, e);
        done();
      }).then(function () {
        assert.ok(false, 'Did not catch');
      });
      deferred.reject();
    });
    it('should return the error when one is set', function (done) {
      var deferred = new Deferred();
      deferred.promise["catch"](function (e) {
        assert.equal('my error msg', e.message);
        done();
      }).then(function () {
        assert.ok(false, 'Did not catch');
      });
      deferred.reject(new Error('my error msg'));
    });
  });
});