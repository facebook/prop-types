function makeEnvironmentsHelpers(makeTests) {
  let React;
  let PropTypes;

  function resetWarningCache() {
    jest.resetModules();

    React = require('react');
    PropTypes = require('../../factory')(React.isValidElement);
  }

  function expectNoop(declaration, value) {
    if (!console.error.calls) {
      spyOn(console, 'error');
    } else {
      console.error.calls.reset();
    }

    const props = {testProp: value};
    const propName = 'testProp' + Math.random().toString();
    const componentName = 'testComponent' + Math.random().toString();
    // Try calling it manually
    for (let i = 0; i < 3; i++) {
      declaration(props, propName, componentName, 'prop');
    }
    // Try calling it via checkPropTypes
    const propTypes = {
      testProp: declaration,
    };
    PropTypes.checkPropTypes(propTypes, props, 'prop', 'testComponent');

    // They should all be no-ops
    expect(console.error.calls.count()).toBe(0);
    console.error.calls.reset();
  }

  describe("React 15 prod", () => {
    beforeAll(function() {
      process.env.NODE_ENV = 'production';
    })

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

      expectPass: expectNoop,
      expectFail: expectNoop,
      expectFailRequiredValues: expectNoop,
      expectWarning: expectNoop,

      expectInvalidValidatorWarning(declaration, type) {
      }
    });
  })
}

module.exports = makeEnvironmentsHelpers;
