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

    PropTypes.checkPropTypes(propTypes, object, 'prop', componentName);
    const callCount = console.error.calls.count();
    if (callCount > 1) {
      throw new Error('Too many warnings.');
    }
    const message = console.error.calls.argsFor(0)[0] || null;
    console.error.calls.reset();

    return message;
  }

  describe("standalone dev", () => {
    beforeEach(() => {
      resetWarningCache();
    });

    makeTests({
      getModules() {
        return { React, PropTypes };
      },

      expectPass(declaration, value) {
        const propTypes = {
          testProp: declaration,
        };
        const props = {
          testProp: value,
        };
        const message = getPropTypeWarningMessage(propTypes, props, 'testComponent');
        expect(message).toBe(null);
      },

      expectFail(declaration, value, expectedMessage) {
        const propTypes = {
          testProp: declaration,
        };
        const props = {
          testProp: value,
        };
        const message = getPropTypeWarningMessage(propTypes, props, 'testComponent');
        expect(message).toContain(expectedMessage);
      },

      expectFailRequiredValues(declaration) {
        const specifiedButIsNullMsg = 'The prop `testProp` is marked as required in ' +
          '`testComponent`, but its value is `null`.';
        const unspecifiedMsg = 'The prop `testProp` is marked as required in ' +
          '`testComponent`, but its value is `undefined`.';

        const propTypes = {testProp: declaration};

        // Required prop is null
        const message1 = getPropTypeWarningMessage(
          propTypes,
          {testProp: null},
          'testComponent',
        );
        expect(message1).toContain(specifiedButIsNullMsg);

        // Required prop is undefined
        const message2 = getPropTypeWarningMessage(
          propTypes,
          {testProp: undefined},
          'testComponent',
        );
        expect(message2).toContain(unspecifiedMsg);

        // Required prop is not a member of props object
        const message3 = getPropTypeWarningMessage(propTypes, {}, 'testComponent');
        expect(message3).toContain(unspecifiedMsg);
      },

      expectWarning(declaration, value) {
        resetWarningCache();
        const props = {testProp: value};
        expect(() => {
          declaration(props, 'testProp', 'testComponent', 'prop');
        }).toThrowError(
          'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
          'Use `PropTypes.checkPropTypes()` to call them. ' +
          'Read more at http://fb.me/use-check-prop-types'
        );
      },

      expectInvalidValidatorWarning(declaration, type) {
        PropTypes.checkPropTypes({ foo: declaration }, { foo: {} }, 'prop', 'testComponent', null);
        expect(console.error.calls.argsFor(0)[0]).toEqual(
          'Warning: Failed prop type: testComponent: prop type `foo.bar` is invalid; '
          + 'it must be a function, usually from the `prop-types` package, but received `' + type + '`.'
        );
        console.error.calls.reset();
      }
    })
  });
}

module.exports = makeEnvironmentsHelpers;
