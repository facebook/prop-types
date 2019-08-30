const makeDevReact15Helpers = require('./React15-dev');
const makeProdReact15Helpers = require('./React15-prod');
const makeDevStandaloneHelpers = require('./standalone-dev');
const makeProdStandaloneHelpers = require('./standalone-prod');

function testInAllEnvironments(makeTests) {
  [
    makeDevReact15Helpers,
    makeProdReact15Helpers,
    makeDevStandaloneHelpers,
    makeProdStandaloneHelpers
  ].map(m => m(makeTests));
}

module.exports = testInAllEnvironments;
