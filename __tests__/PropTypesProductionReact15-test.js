/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */

'use strict';

let React;
let PropTypes;

function resetWarningCache() {
  jest.resetModules();

  // Set production mode throughout this test.
  process.env.NODE_ENV = 'production';
  React = require('react');
  // We are testing that when imported in the same way React 15 imports `prop-types`,
  // it just suppresses warnings but doesn't actually throw when calling validators.
  PropTypes = require('../factory')(React.isValidElement);
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

describe('PropTypesProductionReact15', () => {
  beforeEach(() => {
    resetWarningCache();
  });

  describe('Primitive Types', () => {
    it('should warn for invalid strings', () => {
      expectNoop(
        PropTypes.string,
        [],
        'Invalid prop `testProp` of type `array` supplied to ' +
          '`testComponent`, expected `string`.',
      );
      expectNoop(
        PropTypes.string,
        false,
        'Invalid prop `testProp` of type `boolean` supplied to ' +
          '`testComponent`, expected `string`.',
      );
      expectNoop(
        PropTypes.string,
        0,
        'Invalid prop `testProp` of type `number` supplied to ' +
          '`testComponent`, expected `string`.',
      );
      expectNoop(
        PropTypes.string,
        {},
        'Invalid prop `testProp` of type `object` supplied to ' +
          '`testComponent`, expected `string`.',
      );
      expectNoop(
        PropTypes.string,
        Symbol(),
        'Invalid prop `testProp` of type `symbol` supplied to ' +
          '`testComponent`, expected `string`.',
      );
    });

    it('should fail date and regexp correctly', () => {
      expectNoop(
        PropTypes.string,
        new Date(),
        'Invalid prop `testProp` of type `date` supplied to ' +
          '`testComponent`, expected `string`.',
      );
      expectNoop(
        PropTypes.string,
        /please/,
        'Invalid prop `testProp` of type `regexp` supplied to ' +
          '`testComponent`, expected `string`.',
      );
    });

    it('should not warn for valid values', () => {
      expectNoop(PropTypes.array, []);
      if (typeof BigInt === 'function') {
        expectNoop(PropTypes.bigint, BigInt(0));
      }
      expectNoop(PropTypes.bool, false);
      expectNoop(PropTypes.func, function() {});
      expectNoop(PropTypes.number, 0);
      expectNoop(PropTypes.string, '');
      expectNoop(PropTypes.object, {});
      expectNoop(PropTypes.object, new Date());
      expectNoop(PropTypes.object, /please/);
      expectNoop(PropTypes.symbol, Symbol());
    });

    it('should be implicitly optional and not warn without values', () => {
      expectNoop(PropTypes.string, null);
      expectNoop(PropTypes.string, undefined);
    });

    it('should warn for missing required values', () => {
      expectNoop(PropTypes.string.isRequired);
      expectNoop(PropTypes.array.isRequired);
      expectNoop(PropTypes.symbol.isRequired);
      expectNoop(PropTypes.number.isRequired);
      expectNoop(PropTypes.bigint.isRequired);
      expectNoop(PropTypes.bool.isRequired);
      expectNoop(PropTypes.func.isRequired);
      expectNoop(PropTypes.shape({}).isRequired);
    });

    it('should warn if called manually in development', () => {
      spyOn(console, 'error');
      expectNoop(PropTypes.array, /please/);
      expectNoop(PropTypes.array, []);
      expectNoop(PropTypes.array.isRequired, /please/);
      expectNoop(PropTypes.array.isRequired, []);
      expectNoop(PropTypes.array.isRequired, null);
      expectNoop(PropTypes.array.isRequired, undefined);
      expectNoop(PropTypes.bigint, function() {});
      expectNoop(PropTypes.bigint, 42);
      if (typeof BigInt === 'function') {
        expectNoop(PropTypes.bigint, BigInt(42));
      }
      expectNoop(PropTypes.bigint.isRequired, function() {});
      expectNoop(PropTypes.bigint.isRequired, 42);
      expectNoop(PropTypes.bigint.isRequired, null);
      expectNoop(PropTypes.bigint.isRequired, undefined);
      expectNoop(PropTypes.bool, []);
      expectNoop(PropTypes.bool, true);
      expectNoop(PropTypes.bool.isRequired, []);
      expectNoop(PropTypes.bool.isRequired, true);
      expectNoop(PropTypes.bool.isRequired, null);
      expectNoop(PropTypes.bool.isRequired, undefined);
      expectNoop(PropTypes.func, false);
      expectNoop(PropTypes.func, function() {});
      expectNoop(PropTypes.func.isRequired, false);
      expectNoop(PropTypes.func.isRequired, function() {});
      expectNoop(PropTypes.func.isRequired, null);
      expectNoop(PropTypes.func.isRequired, undefined);
      expectNoop(PropTypes.number, function() {});
      expectNoop(PropTypes.number, 42);
      expectNoop(PropTypes.number.isRequired, function() {});
      expectNoop(PropTypes.number.isRequired, 42);
      expectNoop(PropTypes.number.isRequired, null);
      expectNoop(PropTypes.number.isRequired, undefined);
      expectNoop(PropTypes.string, 0);
      expectNoop(PropTypes.string, 'foo');
      expectNoop(PropTypes.string.isRequired, 0);
      expectNoop(PropTypes.string.isRequired, 'foo');
      expectNoop(PropTypes.string.isRequired, null);
      expectNoop(PropTypes.string.isRequired, undefined);
      expectNoop(PropTypes.symbol, 0);
      expectNoop(PropTypes.symbol, Symbol('Foo'));
      expectNoop(PropTypes.symbol.isRequired, 0);
      expectNoop(PropTypes.symbol.isRequired, Symbol('Foo'));
      expectNoop(PropTypes.symbol.isRequired, null);
      expectNoop(PropTypes.symbol.isRequired, undefined);
      expectNoop(PropTypes.object, '');
      expectNoop(PropTypes.object, {foo: 'bar'});
      expectNoop(PropTypes.object.isRequired, '');
      expectNoop(PropTypes.object.isRequired, {foo: 'bar'});
      expectNoop(PropTypes.object.isRequired, null);
      expectNoop(PropTypes.object.isRequired, undefined);
    });
  });

  describe('Any type', () => {
    it('should accept any value', () => {
      expectNoop(PropTypes.any, 0);
      expectNoop(PropTypes.any, 'str');
      expectNoop(PropTypes.any, []);
      expectNoop(PropTypes.any, Symbol());
    });

    it('should be implicitly optional and not warn without values', () => {
      expectNoop(PropTypes.any, null);
      expectNoop(PropTypes.any, undefined);
    });

    it('should warn for missing required values', () => {
      expectNoop(PropTypes.any.isRequired);
    });

    it('should warn if called manually in development', () => {
      spyOn(console, 'error');
      expectNoop(PropTypes.any, null);
      expectNoop(PropTypes.any.isRequired, null);
      expectNoop(PropTypes.any.isRequired, undefined);
    });
  });

  describe('ArrayOf Type', () => {
    it('should fail for invalid argument', () => {
      expectNoop(
        PropTypes.arrayOf({foo: PropTypes.string}),
        {foo: 'bar'},
        'Property `testProp` of component `testComponent` has invalid PropType notation inside arrayOf.',
      );
    });

    it('should support the arrayOf propTypes', () => {
      expectNoop(PropTypes.arrayOf(PropTypes.number), [1, 2, 3]);
      if (typeof BigInt === 'function') {
        expectNoop(PropTypes.arrayOf(PropTypes.bigint), [BigInt(1), BigInt(2), BigInt(3)]);
      }
      expectNoop(PropTypes.arrayOf(PropTypes.string), ['a', 'b', 'c']);
      expectNoop(PropTypes.arrayOf(PropTypes.oneOf(['a', 'b'])), ['a', 'b']);
      expectNoop(PropTypes.arrayOf(PropTypes.symbol), [Symbol(), Symbol()]);
    });

    it('should support arrayOf with complex types', () => {
      expectNoop(
        PropTypes.arrayOf(PropTypes.shape({a: PropTypes.number.isRequired})),
        [{a: 1}, {a: 2}],
      );

      function Thing() {}
      expectNoop(PropTypes.arrayOf(PropTypes.instanceOf(Thing)), [
        new Thing(),
        new Thing(),
      ]);
    });

    it('should warn with invalid items in the array', () => {
      expectNoop(
        PropTypes.arrayOf(PropTypes.number),
        [1, 2, 'b'],
        'Invalid prop `testProp[2]` of type `string` supplied to ' +
          '`testComponent`, expected `number`.',
      );
    });

    it('should warn with invalid complex types', () => {
      function Thing() {}
      const name = Thing.name || '<<anonymous>>';

      expectNoop(
        PropTypes.arrayOf(PropTypes.instanceOf(Thing)),
        [new Thing(), 'xyz'],
        'Invalid prop `testProp[1]` of type `String` supplied to ' +
          '`testComponent`, expected instance of `' +
          name +
          '`.',
      );
    });

    it('should warn when passed something other than an array', () => {
      expectNoop(
        PropTypes.arrayOf(PropTypes.number),
        {'0': 'maybe-array', length: 1},
        'Invalid prop `testProp` of type `object` supplied to ' +
          '`testComponent`, expected an array.',
      );
      expectNoop(
        PropTypes.arrayOf(PropTypes.number),
        123,
        'Invalid prop `testProp` of type `number` supplied to ' +
          '`testComponent`, expected an array.',
      );
      expectNoop(
        PropTypes.arrayOf(PropTypes.number),
        'string',
        'Invalid prop `testProp` of type `string` supplied to ' +
          '`testComponent`, expected an array.',
      );
    });

    it('should not warn when passing an empty array', () => {
      expectNoop(PropTypes.arrayOf(PropTypes.number), []);
    });

    it('should be implicitly optional and not warn without values', () => {
      expectNoop(PropTypes.arrayOf(PropTypes.number), null);
      expectNoop(PropTypes.arrayOf(PropTypes.number), undefined);
    });

    it('should warn for missing required values', () => {
      expectNoop(
        PropTypes.arrayOf(PropTypes.number).isRequired,
      );
    });

    it('should warn if called manually in development', () => {
      spyOn(console, 'error');
      expectNoop(PropTypes.arrayOf({foo: PropTypes.string}), {
        foo: 'bar',
      });
      expectNoop(PropTypes.arrayOf(PropTypes.number), [
        1,
        2,
        'b',
      ]);
      expectNoop(PropTypes.arrayOf(PropTypes.number), {
        '0': 'maybe-array',
        length: 1,
      });
      expectNoop(
        PropTypes.arrayOf(PropTypes.number).isRequired,
        null,
      );
      expectNoop(
        PropTypes.arrayOf(PropTypes.number).isRequired,
        undefined,
      );
    });
  });

  describe('Component Type', () => {
    it('should support components', () => {
      expectNoop(PropTypes.element, <div />);
    });

    it('should not support multiple components or scalar values', () => {
      expectNoop(
        PropTypes.element,
        [<div />, <div />],
        'Invalid prop `testProp` of type `array` supplied to `testComponent`, ' +
          'expected a single ReactElement.',
      );
      expectNoop(
        PropTypes.element,
        123,
        'Invalid prop `testProp` of type `number` supplied to `testComponent`, ' +
          'expected a single ReactElement.',
      );
      if (typeof BigInt === 'function') {
        expectNoop(
          PropTypes.element,
          BigInt(123),
          'Invalid prop `testProp` of type `bigint` supplied to `testComponent`, ' +
            'expected a single ReactElement.',
        );
      }
      expectNoop(
        PropTypes.element,
        'foo',
        'Invalid prop `testProp` of type `string` supplied to `testComponent`, ' +
          'expected a single ReactElement.',
      );
      expectNoop(
        PropTypes.element,
        false,
        'Invalid prop `testProp` of type `boolean` supplied to `testComponent`, ' +
          'expected a single ReactElement.',
      );
    });

    it('should be implicitly optional and not warn without values', () => {
      expectNoop(PropTypes.element, null);
      expectNoop(PropTypes.element, undefined);
    });

    it('should warn for missing required values', () => {
      expectNoop(PropTypes.element.isRequired);
    });

    it('should warn if called manually in development', () => {
      spyOn(console, 'error');
      expectNoop(PropTypes.element, [<div />, <div />]);
      expectNoop(PropTypes.element, <div />);
      expectNoop(PropTypes.element, 123);
      expectNoop(PropTypes.element, 'foo');
      expectNoop(PropTypes.element, false);
      expectNoop(PropTypes.element.isRequired, null);
      expectNoop(PropTypes.element.isRequired, undefined);
    });
  });

  describe('Instance Types', () => {
    it('should warn for invalid instances', () => {
      function Person() {}
      function Cat() {}
      const personName = Person.name || '<<anonymous>>';
      const dateName = Date.name || '<<anonymous>>';
      const regExpName = RegExp.name || '<<anonymous>>';

      expectNoop(
        PropTypes.instanceOf(Person),
        false,
        'Invalid prop `testProp` of type `Boolean` supplied to ' +
          '`testComponent`, expected instance of `' +
          personName +
          '`.',
      );
      expectNoop(
        PropTypes.instanceOf(Person),
        {},
        'Invalid prop `testProp` of type `Object` supplied to ' +
          '`testComponent`, expected instance of `' +
          personName +
          '`.',
      );
      expectNoop(
        PropTypes.instanceOf(Person),
        '',
        'Invalid prop `testProp` of type `String` supplied to ' +
          '`testComponent`, expected instance of `' +
          personName +
          '`.',
      );
      expectNoop(
        PropTypes.instanceOf(Date),
        {},
        'Invalid prop `testProp` of type `Object` supplied to ' +
          '`testComponent`, expected instance of `' +
          dateName +
          '`.',
      );
      expectNoop(
        PropTypes.instanceOf(RegExp),
        {},
        'Invalid prop `testProp` of type `Object` supplied to ' +
          '`testComponent`, expected instance of `' +
          regExpName +
          '`.',
      );
      expectNoop(
        PropTypes.instanceOf(Person),
        new Cat(),
        'Invalid prop `testProp` of type `Cat` supplied to ' +
          '`testComponent`, expected instance of `' +
          personName +
          '`.',
      );
      expectNoop(
        PropTypes.instanceOf(Person),
        Object.create(null),
        'Invalid prop `testProp` of type `<<anonymous>>` supplied to ' +
          '`testComponent`, expected instance of `' +
          personName +
          '`.',
      );
    });

    it('should not warn for valid values', () => {
      function Person() {}
      function Engineer() {}
      Engineer.prototype = new Person();

      expectNoop(PropTypes.instanceOf(Person), new Person());
      expectNoop(PropTypes.instanceOf(Person), new Engineer());

      expectNoop(PropTypes.instanceOf(Date), new Date());
      expectNoop(PropTypes.instanceOf(RegExp), /please/);
    });

    it('should be implicitly optional and not warn without values', () => {
      expectNoop(PropTypes.instanceOf(String), null);
      expectNoop(PropTypes.instanceOf(String), undefined);
    });

    it('should warn for missing required values', () => {
      expectNoop(PropTypes.instanceOf(String).isRequired);
    });

    it('should warn if called manually in development', () => {
      spyOn(console, 'error');
      expectNoop(PropTypes.instanceOf(Date), {});
      expectNoop(PropTypes.instanceOf(Date), new Date());
      expectNoop(PropTypes.instanceOf(Date).isRequired, {});
      expectNoop(
        PropTypes.instanceOf(Date).isRequired,
        new Date(),
      );
    });
  });

  describe('React Component Types', () => {
    it('should warn for invalid values', () => {
      const failMessage = 'Invalid prop `testProp` supplied to ' +
        '`testComponent`, expected a ReactNode.';
      expectNoop(PropTypes.node, true, failMessage);
      expectNoop(PropTypes.node, function() {}, failMessage);
      expectNoop(PropTypes.node, {key: function() {}}, failMessage);
      expectNoop(PropTypes.node, {key: <div />}, failMessage);
    });

    it('should not warn for valid values', () => {
      function MyComponent() {}
      MyComponent.prototype.render = function() {
        return <div />;
      };
      expectNoop(PropTypes.node, <div />);
      expectNoop(PropTypes.node, false);
      expectNoop(PropTypes.node, <MyComponent />);
      expectNoop(PropTypes.node, 'Some string');
      expectNoop(PropTypes.node, []);
      expectNoop(PropTypes.node, [
        123,
        'Some string',
        <div />,
        ['Another string', [456], <span />, <MyComponent />],
        <MyComponent />,
        null,
        undefined,
      ]);
    });

    it('should not warn for iterables', () => {
      function MyComponent() {}
      MyComponent.prototype.render = function() {
        return <div />;
      };
      const iterable = {
        '@@iterator': function() {
          const i = 0;
          return {
            next: function() {
              const done = ++i > 2;
              return {value: done ? undefined : <MyComponent />, done: done};
            },
          };
        },
      };

      expectNoop(PropTypes.node, iterable);
    });

    it('should not warn for entry iterables', () => {
      function MyComponent() {}
      MyComponent.prototype.render = function() {
        return <div />;
      };
      const iterable = {
        '@@iterator': function() {
          const i = 0;
          return {
            next: function() {
              const done = ++i > 2;
              return {
                value: done ? undefined : ['#' + i, <MyComponent />],
                done: done,
              };
            },
          };
        },
      };
      iterable.entries = iterable['@@iterator'];

      expectNoop(PropTypes.node, iterable);
    });

    it('should not warn for null/undefined if not required', () => {
      expectNoop(PropTypes.node, null);
      expectNoop(PropTypes.node, undefined);
    });

    it('should warn for missing required values', () => {
      expectNoop(PropTypes.node.isRequired);
    });

    it('should accept empty array for required props', () => {
      expectNoop(PropTypes.node.isRequired, []);
    });

    it('should warn if called manually in development', () => {
      spyOn(console, 'error');
      expectNoop(PropTypes.node, 'node');
      expectNoop(PropTypes.node, {});
      expectNoop(PropTypes.node.isRequired, 'node');
      expectNoop(PropTypes.node.isRequired, undefined);
      expectNoop(PropTypes.node.isRequired, undefined);
    });
  });

  describe('ObjectOf Type', () => {
    it('should fail for invalid argument', () => {
      expectNoop(
        PropTypes.objectOf({foo: PropTypes.string}),
        {foo: 'bar'},
        'Property `testProp` of component `testComponent` has invalid PropType notation inside objectOf.',
      );
    });

    it('should support the objectOf propTypes', () => {
      expectNoop(PropTypes.objectOf(PropTypes.number), {a: 1, b: 2, c: 3});
      expectNoop(PropTypes.objectOf(PropTypes.string), {
        a: 'a',
        b: 'b',
        c: 'c',
      });
      expectNoop(PropTypes.objectOf(PropTypes.oneOf(['a', 'b'])), {
        a: 'a',
        b: 'b',
      });
      expectNoop(PropTypes.objectOf(PropTypes.symbol), {
        a: Symbol(),
        b: Symbol(),
        c: Symbol(),
      });
    });

    it('should support objectOf with complex types', () => {
      expectNoop(
        PropTypes.objectOf(PropTypes.shape({a: PropTypes.number.isRequired})),
        {a: {a: 1}, b: {a: 2}},
      );

      function Thing() {}
      expectNoop(PropTypes.objectOf(PropTypes.instanceOf(Thing)), {
        a: new Thing(),
        b: new Thing(),
      });
    });

    it('should warn with invalid items in the object', () => {
      expectNoop(
        PropTypes.objectOf(PropTypes.number),
        {a: 1, b: 2, c: 'b'},
        'Invalid prop `testProp.c` of type `string` supplied to `testComponent`, ' +
          'expected `number`.',
      );

      expectNoop(
        PropTypes.objectOf(PropTypes.number.isRequired),
        {a: 1, b: 2, c: undefined},
        'Warning: Failed prop type: The prop `testProp.c` is marked as required in `testComponent`, ' +
          'but its value is `undefined`.'
      );
    });

    it('should warn with invalid complex types', () => {
      function Thing() {}
      const name = Thing.name || '<<anonymous>>';

      expectNoop(
        PropTypes.objectOf(PropTypes.instanceOf(Thing)),
        {a: new Thing(), b: 'xyz'},
        'Invalid prop `testProp.b` of type `String` supplied to ' +
          '`testComponent`, expected instance of `' +
          name +
          '`.',
      );

      expectNoop(
        PropTypes.objectOf(PropTypes.instanceOf(Thing).isRequired),
        {a: new Thing(), b: undefined},
        'Warning: Failed prop type: The prop `testProp.b` is marked as required in `testComponent`, ' +
          'but its value is `undefined`.'
      );
    });

    it('should warn when passed something other than an object', () => {
      expectNoop(
        PropTypes.objectOf(PropTypes.number),
        [1, 2],
        'Invalid prop `testProp` of type `array` supplied to ' +
          '`testComponent`, expected an object.',
      );
      expectNoop(
        PropTypes.objectOf(PropTypes.number),
        123,
        'Invalid prop `testProp` of type `number` supplied to ' +
          '`testComponent`, expected an object.',
      );
      expectNoop(
        PropTypes.objectOf(PropTypes.number),
        'string',
        'Invalid prop `testProp` of type `string` supplied to ' +
          '`testComponent`, expected an object.',
      );
      expectNoop(
        PropTypes.objectOf(PropTypes.symbol),
        Symbol(),
        'Invalid prop `testProp` of type `symbol` supplied to ' +
          '`testComponent`, expected an object.',
      );
    });

    it('should not warn when passing an object with no prototype', () => {
      expectNoop(PropTypes.objectOf(PropTypes.number), Object.create(null));
    });

    it('should not warn when passing an empty object', () => {
      expectNoop(PropTypes.objectOf(PropTypes.number), {});
    });

    it('should not warn when passing an object with a hasOwnProperty property', () => {
      expectNoop(PropTypes.objectOf(PropTypes.number), {
        hasOwnProperty: 3,
      });
    });

    it('should be implicitly optional and not warn without values', () => {
      expectNoop(PropTypes.objectOf(PropTypes.number), null);
      expectNoop(PropTypes.objectOf(PropTypes.number), undefined);
    });

    it('should warn for missing required values', () => {
      expectNoop(
        PropTypes.objectOf(PropTypes.number).isRequired,
      );
    });

    it('should warn if called manually in development', () => {
      spyOn(console, 'error');
      expectNoop(PropTypes.objectOf({foo: PropTypes.string}), {
        foo: 'bar',
      });
      expectNoop(PropTypes.objectOf(PropTypes.number), {
        a: 1,
        b: 2,
        c: 'b',
      });
      expectNoop(PropTypes.objectOf(PropTypes.number), [1, 2]);
      expectNoop(PropTypes.objectOf(PropTypes.number), null);
      expectNoop(
        PropTypes.objectOf(PropTypes.number),
        undefined,
      );
    });
  });

  describe('OneOf Types', () => {
    it('should ignore invalid argument', () => {
      spyOn(console, 'error');

      PropTypes.oneOf('red', 'blue');

      expect(console.error).not.toHaveBeenCalled();
      expectNoop(PropTypes.oneOf('red', 'blue'), 'red');
    });

    it('should ignore invalid values', () => {
      expectNoop(
        PropTypes.oneOf(['red', 'blue']),
        true,
        'Invalid prop `testProp` of value `true` supplied to ' +
          '`testComponent`, expected one of ["red","blue"].',
      );
      expectNoop(
        PropTypes.oneOf(['red', 'blue']),
        [],
        'Invalid prop `testProp` of value `` supplied to `testComponent`, ' +
          'expected one of ["red","blue"].',
      );
      expectNoop(
        PropTypes.oneOf(['red', 'blue']),
        '',
        'Invalid prop `testProp` of value `` supplied to `testComponent`, ' +
          'expected one of ["red","blue"].',
      );
      expectNoop(
        PropTypes.oneOf([0, 'false']),
        false,
        'Invalid prop `testProp` of value `false` supplied to ' +
          '`testComponent`, expected one of [0,"false"].',
      );
      expectNoop(
        PropTypes.oneOf([Symbol('red'), Symbol('blue')]),
        Symbol('green'),
        'Invalid prop `testProp` of value `Symbol(green)` supplied to ' +
          '`testComponent`, expected one of ["Symbol(red)","Symbol(blue)"].',
      );
      expectNoop(
        PropTypes.oneOf([0, 'false']).isRequired,
        undefined,
        'Warning: Failed prop type: The prop `testProp` is marked as required in `testComponent`, ' +
          'but its value is `undefined`.'
      );
      expectNoop(
        PropTypes.oneOf([0, 'false']).isRequired,
        null,
        'Warning: Failed prop type: The prop `testProp` is marked as required in `testComponent`, ' +
          'but its value is `null`.'
      );
    });

    it('does not fail when the valid types contain null or undefined', () => {
      expectNoop(
        PropTypes.oneOf([0, 'false', null, undefined]),
        false,
        'Warning: Failed prop type: Invalid prop `testProp` of value `false` supplied to ' +
          '`testComponent`, expected one of [0,"false",null,undefined].',
      );
    });

    it('should not warn for valid values', () => {
      expectNoop(PropTypes.oneOf(['red', 'blue']), 'red');
      expectNoop(PropTypes.oneOf(['red', 'blue']), 'blue');
      expectNoop(PropTypes.oneOf(['red', 'blue', NaN]), NaN);
    });

    it('should be implicitly optional and not warn without values', () => {
      expectNoop(PropTypes.oneOf(['red', 'blue']), null);
      expectNoop(PropTypes.oneOf(['red', 'blue']), undefined);
    });

    it('should warn for missing required values', () => {
      expectNoop(PropTypes.oneOf(['red', 'blue']).isRequired);
    });

    it('should warn if called manually in development', () => {
      spyOn(console, 'error');
      expectNoop(PropTypes.oneOf(['red', 'blue']), true);
      expectNoop(PropTypes.oneOf(['red', 'blue']), null);
      expectNoop(PropTypes.oneOf(['red', 'blue']), undefined);
    });
  });

  describe('Union Types', () => {
    it('should ignore invalid argument', () => {
      spyOn(console, 'error');

      PropTypes.oneOfType(PropTypes.string, PropTypes.number);

      expect(console.error).not.toHaveBeenCalled();
      expectNoop(PropTypes.oneOf(PropTypes.string, PropTypes.number), []);
    });

    it('should warn if none of the types are valid', () => {
      expectNoop(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        [],
        'Invalid prop `testProp` supplied to `testComponent`.',
      );

      const checker = PropTypes.oneOfType([
        PropTypes.shape({a: PropTypes.number.isRequired}),
        PropTypes.shape({b: PropTypes.number.isRequired}),
      ]);
      expectNoop(
        checker,
        {c: 1},
        'Invalid prop `testProp` supplied to `testComponent`.',
      );
    });

    it('should not warn if one of the types are valid', () => {
      let checker = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
      expectNoop(checker, null);
      expectNoop(checker, 'foo');
      expectNoop(checker, 123);

      checker = PropTypes.oneOfType([
        PropTypes.shape({a: PropTypes.number.isRequired}),
        PropTypes.shape({b: PropTypes.number.isRequired}),
      ]);
      expectNoop(checker, {a: 1});
      expectNoop(checker, {b: 1});
    });

    it('should be implicitly optional and not warn without values', () => {
      expectNoop(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        null,
      );
      expectNoop(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        undefined,
      );
    });

    it('should warn for missing required values', () => {
      expectNoop(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      );
    });

    it('should warn if called manually in development', () => {
      spyOn(console, 'error');
      expectNoop(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        [],
      );
      expectNoop(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        null,
      );
      expectNoop(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        undefined,
      );
    });

    it('should not warn if setup without checker function', () => {
      expectNoop(
        PropTypes.oneOfType([null]),
        null,
      );
      expectNoop(
        PropTypes.oneOfType([undefined]),
        undefined,
      );
    });
  });

  describe('Shape Types', () => {
    it('should warn for non objects', () => {
      expectNoop(
        PropTypes.shape({}),
        'some string',
        'Invalid prop `testProp` of type `string` supplied to ' +
          '`testComponent`, expected `object`.',
      );
      expectNoop(
        PropTypes.shape({}),
        ['array'],
        'Invalid prop `testProp` of type `array` supplied to ' +
          '`testComponent`, expected `object`.',
      );
    });

    it('should not warn for empty values', () => {
      expectNoop(PropTypes.shape({}), undefined);
      expectNoop(PropTypes.shape({}), null);
      expectNoop(PropTypes.shape({}), {});
    });

    it('should not warn for an empty object', () => {
      expectNoop(PropTypes.shape({}).isRequired, {});
    });

    it('should not warn for non specified types', () => {
      expectNoop(PropTypes.shape({}), {key: 1});
    });

    it('should not warn for valid types', () => {
      expectNoop(PropTypes.shape({key: PropTypes.number}), {key: 1});
    });

    it('should warn for required valid types', () => {
      expectNoop(
        PropTypes.shape({key: PropTypes.number.isRequired}),
        {},
        'The prop `testProp.key` is marked as required in `testComponent`, ' +
          'but its value is `undefined`.',
      );

      expectNoop(
        PropTypes.shape({key: PropTypes.number.isRequired}),
        {key: undefined},
        'The prop `testProp.key` is marked as required in `testComponent`, ' +
          'but its value is `undefined`.',
      );

      expectNoop(
        PropTypes.shape({key: PropTypes.number.isRequired}),
        {key: null},
        'The prop `testProp.key` is marked as required in `testComponent`, ' +
          'but its value is `null`.',
      );
    });

    it('should warn for the first required type', () => {
      expectNoop(
        PropTypes.shape({
          key: PropTypes.number.isRequired,
          secondKey: PropTypes.number.isRequired,
        }),
        {},
        'The prop `testProp.key` is marked as required in `testComponent`, ' +
          'but its value is `undefined`.',
      );
    });

    it('should warn for invalid key types', () => {
      expectNoop(
        PropTypes.shape({key: PropTypes.number}),
        {key: 'abc'},
        'Invalid prop `testProp.key` of type `string` supplied to `testComponent`, ' +
          'expected `number`.',
      );
    });

    it('should be implicitly optional and not warn without values', () => {
      expectNoop(
        PropTypes.shape(PropTypes.shape({key: PropTypes.number})),
        null,
      );
      expectNoop(
        PropTypes.shape(PropTypes.shape({key: PropTypes.number})),
        undefined,
      );
    });

    it('should warn for missing required values', () => {
      expectNoop(
        PropTypes.shape({key: PropTypes.number}).isRequired,
      );
    });

    it('should warn if called manually in development', () => {
      spyOn(console, 'error');
      expectNoop(PropTypes.shape({}), 'some string');
      expectNoop(PropTypes.shape({foo: PropTypes.number}), {
        foo: 42,
      });
      expectNoop(
        PropTypes.shape({key: PropTypes.number}).isRequired,
        null,
      );
      expectNoop(
        PropTypes.shape({key: PropTypes.number}).isRequired,
        undefined,
      );
      expectNoop(PropTypes.element, <div />);
    });
  });

  describe('Exact Types', () => {
    it('should warn for non objects', () => {
      expectNoop(
        PropTypes.exact({}),
        'some string'
      );
      expectNoop(
        PropTypes.exact({}),
        ['array']
      );
    });

    it('should not warn for empty values', () => {
      expectNoop(PropTypes.exact({}), undefined);
      expectNoop(PropTypes.exact({}), null);
      expectNoop(PropTypes.exact({}), {});
    });

    it('should not warn for an empty object', () => {
      expectNoop(PropTypes.exact({}).isRequired, {});
    });

    it('expectNoop warn for non specified types', () => {
      expectNoop(
        PropTypes.exact({}),
        {key: 1}
      );
    });

    it('should not warn for valid types', () => {
      expectNoop(PropTypes.exact({key: PropTypes.number}), {key: 1});
    });

    it('should warn for required valid types', () => {
      expectNoop(
        PropTypes.exact({key: PropTypes.number.isRequired}),
        {}
      );
    });

    it('should warn for the first required type', () => {
      expectNoop(
        PropTypes.exact({
          key: PropTypes.number.isRequired,
          secondKey: PropTypes.number.isRequired,
        }),
        {}
      );
    });

    it('should warn for invalid key types', () => {
      expectNoop(
        PropTypes.exact({key: PropTypes.number}),
        {key: 'abc'}
      );
    });

    it('should be implicitly optional and not warn without values', () => {
      expectNoop(
        PropTypes.exact(PropTypes.exact({key: PropTypes.number})),
        null,
      );
      expectNoop(
        PropTypes.exact(PropTypes.exact({key: PropTypes.number})),
        undefined,
      );
    });

    it('should warn for missing required values', () => {
      expectNoop(
        PropTypes.exact({key: PropTypes.number}).isRequired,
      );
    });

    it('should warn if called manually in development', () => {
      expectNoop(PropTypes.exact({}), 'some string');
      expectNoop(PropTypes.exact({foo: PropTypes.number}), {
        foo: 42,
      });
      expectNoop(
        PropTypes.exact({key: PropTypes.number}).isRequired,
        null,
      );
      expectNoop(
        PropTypes.exact({key: PropTypes.number}).isRequired,
        undefined,
      );
      expectNoop(PropTypes.element, <div />);
    });

    it('works with oneOfType', () => {
      expectNoop(
        PropTypes.exact({ foo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]) }),
        { foo: 42 }
      );
      expectNoop(
        PropTypes.exact({ foo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]) }),
        { foo: '42' }
      );
      expectNoop(
        PropTypes.exact({ foo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]) }),
        { foo: 42, bar: 'what is 6 * 7' }
      );
    });

    it('works with a custom propType', () => {
      expectNoop(
        PropTypes.oneOfType([() => new Error('hi')]),
        {}
      )
    });
  });

  describe('Symbol Type', () => {
    it('should warn for non-symbol', () => {
      expectNoop(
        PropTypes.symbol,
        'hello',
        'Invalid prop `testProp` of type `string` supplied to ' +
          '`testComponent`, expected `symbol`.',
      );
      expectNoop(
        PropTypes.symbol,
        function() {},
        'Invalid prop `testProp` of type `function` supplied to ' +
          '`testComponent`, expected `symbol`.',
      );
      expectNoop(
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
      expectNoop(PropTypes.symbol, CoreSymbol('core-js'));
    });
  });

  describe('checkPropTypes', function() {
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
