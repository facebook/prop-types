/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var generalizedUsage = false;

function shouldDoSomething() {
  return generalizedUsage || process.env.NODE_ENV !== 'production';
}

function generalize(degeneralize) {
  generalizedUsage = !degeneralize;
}

function isGeneralizedUsage() {
  return generalizedUsage;
}

module.exports = {
  shouldDoSomething: shouldDoSomething,
  generalize: generalize,
  isGeneralizedUsage: isGeneralizedUsage
};
