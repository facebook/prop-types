function makeEnvironmentsHelpers(makeTests) {
  let React;
  let PropTypes;

  function resetWarningCache() {
    jest.resetModules();

    React = require('react');
    PropTypes = require('../../index');
  }

  function getPropTypeWarningMessage(propTypes, object, componentName) {
    if (!console.error.calls) {
      spyOn(console, 'error');
    } else {
      console.error.calls.reset();
    }
    resetWarningCache();
    PropTypes.checkPropTypes(propTypes, object, 'prop', 'testComponent');
    const callCount = console.error.calls.count();
    if (callCount > 1) {
      throw new Error('Too many warnings.');
    }
    const message = console.error.calls.argsFor(0)[0] || null;
    console.error.calls.reset();

    return message;
  }

  function expectThrows(declaration, value) {
    resetWarningCache();
    const props = {testProp: value};
    expect(() => {
      declaration(props, 'testProp', 'testComponent', 'prop');
    }).toThrowError(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  }

  describe("standalone prod", () => {
    beforeAll(function() {
      process.env.NODE_ENV = 'production';
    });

    afterAll(function() {
      delete process.env.NODE_ENV;
    });

    beforeEach(() => {
      resetWarningCache();
    });

    makeTests({
      getModules() {
        return { React, PropTypes };
      },

      expectPass: expectThrows,
      expectFail: expectThrows,
      expectFailRequiredValues: expectThrows,
      expectWarning: expectThrows,

      expectInvalidValidatorWarning(declaration, type) {
      }
    });
  });
}

module.exports = makeEnvironmentsHelpers;
