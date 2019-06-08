/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var shouldDoSomething = require('./shouldDoSomething');

function init() {
  if (shouldDoSomething()) {
    var ReactIs = require('react-is');
  
    // By explicitly using `prop-types` you are opting into new development behavior.
    // http://fb.me/prop-types-in-prod
    var throwOnDirectAccess = true;
    module.exports = require('./factoryWithTypeCheckers')(ReactIs.isElement, throwOnDirectAccess);
  } else {
    // By explicitly using `prop-types` you are opting into new production behavior.
    // http://fb.me/prop-types-in-prod
    module.exports = require('./factoryWithThrowingShims')();
  }
}

init();

module.exports.generalize = function(degeneralize) {
  shouldDoSomething.generalize(degeneralize);
  init();
}
