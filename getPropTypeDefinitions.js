/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

/**
 * return object with the expected values for all props.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @return {object} type, expectedValues, shapeTypes
 */
function getPropTypeDefinitions(typeSpecs) {
  if (process.env.NODE_ENV !== 'production') {
    var propTypeDefinitions = {};
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        propTypeDefinitions[typeSpecName] = typeSpecs[typeSpecName].propTypeDefinition
      }
    }
    return propTypeDefinitions;
  }
}

module.exports = getPropTypeDefinitions;
