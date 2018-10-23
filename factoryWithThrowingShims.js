/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');

function emptyFunction() {}

module.exports = function() {
  function getShim() {
    function shim(props, propName, componentName, location, propFullName, secret) {
      if (secret === ReactPropTypesSecret) {
        // It is still safe when called from React.
        return;
      }
      var err = new Error(
        'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
        'Use PropTypes.checkPropTypes() to call them. ' +
        'Read more at http://fb.me/use-check-prop-types'
      );
      err.name = 'Invariant Violation';
      throw err;
    };

    shim.isRequired = shim;

    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: getShim(),
    bool: getShim(),
    func: getShim(),
    number: getShim(),
    object: getShim(),
    string: getShim(),
    symbol: getShim(),

    any: getShim(),
    arrayOf: getShim,
    element: getShim(),
    instanceOf: getShim,
    node: getShim(),
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};
