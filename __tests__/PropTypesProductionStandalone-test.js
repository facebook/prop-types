/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */

'use strict';

describe('PropTypesProductionStandalone', () => {
  let React;
  let PropTypes;

  function resetWarningCache() {
    jest.resetModules();
    process.env.NODE_ENV = 'production';

    React = require('react');
    PropTypes = require('../index');
  }

  beforeEach(() => {
    resetWarningCache();
  });

  afterEach(() => {
    delete process.env.NODE_ENV;
  });

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

  function expectThrowsInProduction(declaration, value) {
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

  function typeCheckPass(declaration, value) {
    const propTypes = {
      testProp: declaration,
    };
    const props = {
      testProp: value,
    };
    const message = getPropTypeWarningMessage(propTypes, props, 'testComponent');
    expect(message).toBe(null);
  }

  describe('Primitive Types', () => {
    it('should be a no-op', () => {
      expectThrowsInProduction(PropTypes.array, /please/);
      expectThrowsInProduction(PropTypes.array.isRequired, /please/);
      expectThrowsInProduction(PropTypes.array.isRequired, null);
      expectThrowsInProduction(PropTypes.array.isRequired, undefined);
      expectThrowsInProduction(PropTypes.bigint, function() {});
      expectThrowsInProduction(PropTypes.bigint, 42);
      if (typeof BigInt === 'function') {
        expectThrowsInProduction(PropTypes.bigint, BigInt(42));
      }
      expectThrowsInProduction(PropTypes.bigint.isRequired, function() {});
      expectThrowsInProduction(PropTypes.bigint.isRequired, 42);
      expectThrowsInProduction(PropTypes.bigint.isRequired, null);
      expectThrowsInProduction(PropTypes.bigint.isRequired, undefined);
      expectThrowsInProduction(PropTypes.bool, []);
      expectThrowsInProduction(PropTypes.bool.isRequired, []);
      expectThrowsInProduction(PropTypes.bool.isRequired, null);
      expectThrowsInProduction(PropTypes.bool.isRequired, undefined);
      expectThrowsInProduction(PropTypes.func, false);
      expectThrowsInProduction(PropTypes.func.isRequired, false);
      expectThrowsInProduction(PropTypes.func.isRequired, null);
      expectThrowsInProduction(PropTypes.func.isRequired, undefined);
      expectThrowsInProduction(PropTypes.number, function() {});
      expectThrowsInProduction(PropTypes.number.isRequired, function() {});
      expectThrowsInProduction(PropTypes.number.isRequired, null);
      expectThrowsInProduction(PropTypes.number.isRequired, undefined);
      expectThrowsInProduction(PropTypes.string, 0);
      expectThrowsInProduction(PropTypes.string.isRequired, 0);
      expectThrowsInProduction(PropTypes.string.isRequired, null);
      expectThrowsInProduction(PropTypes.string.isRequired, undefined);
      expectThrowsInProduction(PropTypes.symbol, 0);
      expectThrowsInProduction(PropTypes.symbol.isRequired, 0);
      expectThrowsInProduction(PropTypes.symbol.isRequired, null);
      expectThrowsInProduction(PropTypes.symbol.isRequired, undefined);
      expectThrowsInProduction(PropTypes.object, '');
      expectThrowsInProduction(PropTypes.object.isRequired, '');
      expectThrowsInProduction(PropTypes.object.isRequired, null);
      expectThrowsInProduction(PropTypes.object.isRequired, undefined);
    });
  });

  describe('Any Type', () => {
    it('should be a no-op', () => {
      expectThrowsInProduction(PropTypes.any, null);
      expectThrowsInProduction(PropTypes.any.isRequired, null);
      expectThrowsInProduction(PropTypes.any.isRequired, undefined);
    });
  });

  describe('ArrayOf Type', () => {
    it('should be a no-op', () => {
      expectThrowsInProduction(PropTypes.arrayOf({foo: PropTypes.string}), {
        foo: 'bar',
      });
      expectThrowsInProduction(PropTypes.arrayOf(PropTypes.number), [
        1,
        2,
        'b',
      ]);
      expectThrowsInProduction(PropTypes.arrayOf(PropTypes.number), {
        '0': 'maybe-array',
        length: 1,
      });
      expectThrowsInProduction(
        PropTypes.arrayOf(PropTypes.number).isRequired,
        null,
      );
      expectThrowsInProduction(
        PropTypes.arrayOf(PropTypes.number).isRequired,
        undefined,
      );
    });
  });

  describe('Component Type', () => {
    it('should be a no-op', () => {
      expectThrowsInProduction(PropTypes.element, [<div />, <div />]);
      expectThrowsInProduction(PropTypes.element, 123);
      if (typeof BigInt === 'function') {
        expectThrowsInProduction(PropTypes.element, BigInt(123));
      }
      expectThrowsInProduction(PropTypes.element, 'foo');
      expectThrowsInProduction(PropTypes.element, false);
      expectThrowsInProduction(PropTypes.element.isRequired, null);
      expectThrowsInProduction(PropTypes.element.isRequired, undefined);
    });
  });

  describe('Instance Types', () => {
    it('should be a no-op', () => {
      expectThrowsInProduction(PropTypes.instanceOf(Date), {});
      expectThrowsInProduction(PropTypes.instanceOf(Date).isRequired, {});
    });
  });

  describe('React Component Types', () => {
    it('should be a no-op', () => {
      expectThrowsInProduction(PropTypes.node, {});
      expectThrowsInProduction(PropTypes.node.isRequired, null);
      expectThrowsInProduction(PropTypes.node.isRequired, undefined);
    });
  });

  describe('React ElementType Type', () => {
    it('should be a no-op', () => {
      expectThrowsInProduction(PropTypes.elementType.isRequired, false);
      expectThrowsInProduction(PropTypes.elementType.isRequired, {});
    });
  });

  describe('ObjectOf Type', () => {
    it('should be a no-op', () => {
      expectThrowsInProduction(PropTypes.objectOf({foo: PropTypes.string}), {
        foo: 'bar',
      });
      expectThrowsInProduction(PropTypes.objectOf(PropTypes.number), {
        a: 1,
        b: 2,
        c: 'b',
      });
      expectThrowsInProduction(PropTypes.objectOf(PropTypes.number), [1, 2]);
      expectThrowsInProduction(PropTypes.objectOf(PropTypes.number), null);
      expectThrowsInProduction(PropTypes.objectOf(PropTypes.number), undefined);
    });
  });

  describe('OneOf Types', () => {
    it('should be a no-op', () => {
      expectThrowsInProduction(PropTypes.oneOf('red', 'blue'), 'red');
      expectThrowsInProduction(PropTypes.oneOf(['red', 'blue']), true);
      expectThrowsInProduction(PropTypes.oneOf(['red', 'blue']), null);
      expectThrowsInProduction(PropTypes.oneOf(['red', 'blue']), undefined);
    });
  });

  describe('Union Types', () => {
    it('should be a no-op', () => {
      expectThrowsInProduction(
        PropTypes.oneOfType(PropTypes.string, PropTypes.number),
        'red',
      );
      expectThrowsInProduction(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        [],
      );
      expectThrowsInProduction(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        null,
      );
      expectThrowsInProduction(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        undefined,
      );
    });
  });

  describe('Shape Types', () => {
    it('should be a no-op', () => {
      expectThrowsInProduction(PropTypes.shape({}), 'some string');
      expectThrowsInProduction(
        PropTypes.shape({key: PropTypes.number}).isRequired,
        null,
      );
      expectThrowsInProduction(
        PropTypes.shape({key: PropTypes.number}).isRequired,
        undefined,
      );
    });
  });

  describe('Exact Types', () => {
    it('should warn for non objects', () => {
      spyOn(console, 'error');
      expectThrowsInProduction(
        PropTypes.exact({}),
        'some string'
      );
      expectThrowsInProduction(
        PropTypes.exact({}),
        ['array']
      );
    });

    it('should not warn for empty values', () => {
      typeCheckPass(PropTypes.exact({}), undefined);
      typeCheckPass(PropTypes.exact({}), null);
      typeCheckPass(PropTypes.exact({}), {});
    });

    it('should not warn for an empty object', () => {
      typeCheckPass(PropTypes.exact({}).isRequired, {});
    });

    it('should warn for non specified types', () => {
      expectThrowsInProduction(
        PropTypes.exact({}),
        {key: 1},
        'Warning: Failed prop type: Invalid prop `testProp` key `key` supplied to `testComponent`.' +
        '\nBad object: {' +
        '\n  \"key\": 1' +
        '\n}' +
        '\nValid keys: []'
      );
    });

    it('should not warn for valid types', () => {
      typeCheckPass(PropTypes.exact({key: PropTypes.number}), {key: 1});
    });

    it('should warn for required valid types', () => {
      expectThrowsInProduction(
        PropTypes.exact({key: PropTypes.number.isRequired}),
        {},
        'The prop `testProp.key` is marked as required in `testComponent`, ' +
          'but its value is `undefined`.',
      );
    });

    it('should warn for the first required type', () => {
      expectThrowsInProduction(
        PropTypes.exact({
          key: PropTypes.number.isRequired,
          secondKey: PropTypes.number.isRequired,
        }),
        {},
        'The prop `testProp.key` is marked as required in `testComponent`, ' +
          'but its value is `undefined`.',
      );
    });

    it('should warn for invalid key types', () => {
      expectThrowsInProduction(
        PropTypes.exact({key: PropTypes.number}),
        {key: 'abc'},
        'Invalid prop `testProp.key` of type `string` supplied to `testComponent`, ' +
          'expected `number`.',
      );
    });

    it('should be implicitly optional and not warn without values', () => {
      typeCheckPass(
        PropTypes.exact(PropTypes.exact({key: PropTypes.number})),
        null,
      );
      typeCheckPass(
        PropTypes.exact(PropTypes.exact({key: PropTypes.number})),
        undefined,
      );
    });

    it('should warn for missing required values', () => {
      expectThrowsInProduction(
        PropTypes.exact({key: PropTypes.number}).isRequired,
      );
    });

    it('works with oneOfType', () => {
      typeCheckPass(
        PropTypes.exact({ foo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]) }),
        { foo: 42 }
      );
      typeCheckPass(
        PropTypes.exact({ foo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]) }),
        { foo: '42' }
      );
      expectThrowsInProduction(
        PropTypes.exact({ foo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]) }),
        { foo: 42, bar: 'what is 6 * 7' },
        `Warning: Failed prop type: Invalid prop \`testProp\` key \`bar\` supplied to \`testComponent\`.
Bad object: {
  "foo": 42,
  "bar": "what is 6 * 7"
}
Valid keys: [
  "foo"
]`
      );
    });

    it('works with a custom propType', () => {
      expectThrowsInProduction(
        PropTypes.oneOfType([() => new Error('hi')]),
        {},
        'Warning: Failed prop type: Invalid prop `testProp` supplied to `testComponent`.'
      )
    });
  });

  describe('Symbol Type', () => {
    it('should warn for non-symbol', () => {
      expectThrowsInProduction(
        PropTypes.symbol,
        'hello',
        'Invalid prop `testProp` of type `string` supplied to ' +
          '`testComponent`, expected `symbol`.',
      );
      expectThrowsInProduction(
        PropTypes.symbol,
        function() {},
        'Invalid prop `testProp` of type `function` supplied to ' +
          '`testComponent`, expected `symbol`.',
      );
      expectThrowsInProduction(
        PropTypes.symbol,
        {
          '@@toStringTag': 'Katana',
        },
        'Invalid prop `testProp` of type `object` supplied to ' +
          '`testComponent`, expected `symbol`.',
      );
    });

    it('should not warn for a polyfilled Symbol', () => {
      const CoreSymbol = require('core-js/library/es6/symbol');
      typeCheckPass(PropTypes.symbol, CoreSymbol('core-js'));
    });
  });

  describe('checkPropTypes', () => {
    it('does not call validators', () => {
      spyOn(console, 'error');

      const spy = jest.fn();
      typeCheckPass(PropTypes.string, 42);
      typeCheckPass(PropTypes.bool, 'whatever');
      typeCheckPass(spy, 'no way');
      expect(spy).not.toBeCalled();
    });

    describe('checkPropTypes.resetWarningCache', () => {
      it('should provide empty function', () => {
        spyOn(console, 'error');

        var spy = jest.fn();
        PropTypes.checkPropTypes.resetWarningCache();
        expect(spy).not.toBeCalled();
      });
    });
  });

  describe('resetWarningCache', () => {
    it('should provide empty function', () => {
      spyOn(console, 'error');

      var spy = jest.fn();
      PropTypes.resetWarningCache();
      expect(spy).not.toBeCalled();
    });
  });
});
