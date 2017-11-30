/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */

'use strict';

var React;
var PropTypes;

function resetWarningCache() {
  jest.resetModules();

  React = require('react');
  PropTypes = require('../index');
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

function typeCheckFail(declaration, value, expectedMessage) {
  const propTypes = {
    testProp: declaration,
  };
  const props = {
    testProp: value,
  };
  const message = getPropTypeWarningMessage(propTypes, props, 'testComponent');
  expect(message).toContain(expectedMessage);
}

function typeCheckFailRequiredValues(declaration) {
  var specifiedButIsNullMsg = 'The prop `testProp` is marked as required in ' +
    '`testComponent`, but its value is `null`.';
  var unspecifiedMsg = 'The prop `testProp` is marked as required in ' +
    '`testComponent`, but its value is \`undefined\`.';

  var propTypes = {testProp: declaration};

  // Required prop is null
  var message1 = getPropTypeWarningMessage(
    propTypes,
    {testProp: null},
    'testComponent',
  );
  expect(message1).toContain(specifiedButIsNullMsg);

  // Required prop is undefined
  var message2 = getPropTypeWarningMessage(
    propTypes,
    {testProp: undefined},
    'testComponent',
  );
  expect(message2).toContain(unspecifiedMsg);

  // Required prop is not a member of props object
  var message3 = getPropTypeWarningMessage(propTypes, {}, 'testComponent');
  expect(message3).toContain(unspecifiedMsg);
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

function expectThrowsInDevelopment(declaration, value) {
  resetWarningCache();
  var props = {testProp: value};
  expect(() => {
    declaration(props, 'testProp', 'testComponent', 'prop');
  }).toThrowError(
    'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
    'Use `PropTypes.checkPropTypes()` to call them. ' +
    'Read more at http://fb.me/use-check-prop-types'
  );
}

describe('PropTypesDevelopmentStandalone', () => {
  beforeEach(() => {
    resetWarningCache();
  });

  describe('checkPropTypes', () => {
    it('should warn for invalid validators', () => {
      spyOn(console, 'error')
      const propTypes = { foo: undefined };
      const props = { foo: 'foo' };
      PropTypes.checkPropTypes(
        propTypes,
        props,
        'prop',
        'testComponent',
        null,
      );
      expect(console.error.calls.argsFor(0)[0]).toEqual(
        'Warning: Failed prop type: testComponent: prop type `foo` is invalid; ' +
        'it must be a function, usually from the `prop-types` package, but received `undefined`.'
      );
    });

    it('does not return a value from a validator', () => {
      spyOn(console, 'error');
      const propTypes = {
        foo(props, propName, componentName) {
          return new Error('some error');
        },
      };
      const props = {foo: 'foo'};
      const returnValue = PropTypes.checkPropTypes(
        propTypes,
        props,
        'prop',
        'testComponent',
        null,
      );
      expect(console.error.calls.argsFor(0)[0]).toContain('some error');
      expect(returnValue).toBe(undefined);
    });

    it('does not throw if validator throws', () => {
      spyOn(console, 'error');
      const propTypes = {
        foo(props, propName, componentName) {
          throw new Error('some error');
        },
      };
      const props = {foo: 'foo'};
      const returnValue = PropTypes.checkPropTypes(
        propTypes,
        props,
        'prop',
        'testComponent',
        null,
      );
      expect(console.error.calls.argsFor(0)[0]).toContain('some error');
      expect(returnValue).toBe(undefined);
    });

    it('warns if any of the propTypes is not a function', () => {
      spyOn(console, 'error');
      const propTypes = {
        foo: PropTypes.invalid_type,
      };
      const props = { foo: 'foo' };
      const returnValue = PropTypes.checkPropTypes(propTypes, props, 'prop', 'testComponent', null);
      expect(console.error.calls.argsFor(0)[0]).toEqual(
        'Warning: Failed prop type: testComponent: prop type `foo` is invalid; '
        + 'it must be a function, usually from the `prop-types` package, but received `undefined`.'
      );
      expect(returnValue).toBe(undefined);
    });
  });

  describe('Primitive Types', () => {
    it('should warn for invalid strings', () => {
      typeCheckFail(
        PropTypes.string,
        [],
        'Invalid prop `testProp` of type `array` supplied to ' +
          '`testComponent`, expected `string`.',
      );
      typeCheckFail(
        PropTypes.string,
        false,
        'Invalid prop `testProp` of type `boolean` supplied to ' +
          '`testComponent`, expected `string`.',
      );
      typeCheckFail(
        PropTypes.string,
        0,
        'Invalid prop `testProp` of type `number` supplied to ' +
          '`testComponent`, expected `string`.',
      );
      typeCheckFail(
        PropTypes.string,
        {},
        'Invalid prop `testProp` of type `object` supplied to ' +
          '`testComponent`, expected `string`.',
      );
      typeCheckFail(
        PropTypes.string,
        Symbol(),
        'Invalid prop `testProp` of type `symbol` supplied to ' +
          '`testComponent`, expected `string`.',
      );
    });

    it('should fail date and regexp correctly', () => {
      typeCheckFail(
        PropTypes.string,
        new Date(),
        'Invalid prop `testProp` of type `date` supplied to ' +
          '`testComponent`, expected `string`.',
      );
      typeCheckFail(
        PropTypes.string,
        /please/,
        'Invalid prop `testProp` of type `regexp` supplied to ' +
          '`testComponent`, expected `string`.',
      );
    });

    it('should not warn for valid values', () => {
      typeCheckPass(PropTypes.array, []);
      typeCheckPass(PropTypes.bool, false);
      typeCheckPass(PropTypes.func, function() {});
      typeCheckPass(PropTypes.number, 0);
      typeCheckPass(PropTypes.string, '');
      typeCheckPass(PropTypes.object, {});
      typeCheckPass(PropTypes.object, new Date());
      typeCheckPass(PropTypes.object, /please/);
      typeCheckPass(PropTypes.symbol, Symbol());
    });

    it('should be implicitly optional and not warn without values', () => {
      typeCheckPass(PropTypes.string, null);
      typeCheckPass(PropTypes.string, undefined);
    });

    it('should warn for missing required values', () => {
      typeCheckFailRequiredValues(PropTypes.string.isRequired);
    });

    it('should warn if called manually in development', () => {
      spyOn(console, 'error');
      expectThrowsInDevelopment(PropTypes.array, /please/);
      expectThrowsInDevelopment(PropTypes.array, []);
      expectThrowsInDevelopment(PropTypes.array.isRequired, /please/);
      expectThrowsInDevelopment(PropTypes.array.isRequired, []);
      expectThrowsInDevelopment(PropTypes.array.isRequired, null);
      expectThrowsInDevelopment(PropTypes.array.isRequired, undefined);
      expectThrowsInDevelopment(PropTypes.bool, []);
      expectThrowsInDevelopment(PropTypes.bool, true);
      expectThrowsInDevelopment(PropTypes.bool.isRequired, []);
      expectThrowsInDevelopment(PropTypes.bool.isRequired, true);
      expectThrowsInDevelopment(PropTypes.bool.isRequired, null);
      expectThrowsInDevelopment(PropTypes.bool.isRequired, undefined);
      expectThrowsInDevelopment(PropTypes.func, false);
      expectThrowsInDevelopment(PropTypes.func, function() {});
      expectThrowsInDevelopment(PropTypes.func.isRequired, false);
      expectThrowsInDevelopment(PropTypes.func.isRequired, function() {});
      expectThrowsInDevelopment(PropTypes.func.isRequired, null);
      expectThrowsInDevelopment(PropTypes.func.isRequired, undefined);
      expectThrowsInDevelopment(PropTypes.number, function() {});
      expectThrowsInDevelopment(PropTypes.number, 42);
      expectThrowsInDevelopment(PropTypes.number.isRequired, function() {});
      expectThrowsInDevelopment(PropTypes.number.isRequired, 42);
      expectThrowsInDevelopment(PropTypes.number.isRequired, null);
      expectThrowsInDevelopment(PropTypes.number.isRequired, undefined);
      expectThrowsInDevelopment(PropTypes.string, 0);
      expectThrowsInDevelopment(PropTypes.string, 'foo');
      expectThrowsInDevelopment(PropTypes.string.isRequired, 0);
      expectThrowsInDevelopment(PropTypes.string.isRequired, 'foo');
      expectThrowsInDevelopment(PropTypes.string.isRequired, null);
      expectThrowsInDevelopment(PropTypes.string.isRequired, undefined);
      expectThrowsInDevelopment(PropTypes.symbol, 0);
      expectThrowsInDevelopment(PropTypes.symbol, Symbol('Foo'));
      expectThrowsInDevelopment(PropTypes.symbol.isRequired, 0);
      expectThrowsInDevelopment(PropTypes.symbol.isRequired, Symbol('Foo'));
      expectThrowsInDevelopment(PropTypes.symbol.isRequired, null);
      expectThrowsInDevelopment(PropTypes.symbol.isRequired, undefined);
      expectThrowsInDevelopment(PropTypes.object, '');
      expectThrowsInDevelopment(PropTypes.object, {foo: 'bar'});
      expectThrowsInDevelopment(PropTypes.object.isRequired, '');
      expectThrowsInDevelopment(PropTypes.object.isRequired, {foo: 'bar'});
      expectThrowsInDevelopment(PropTypes.object.isRequired, null);
      expectThrowsInDevelopment(PropTypes.object.isRequired, undefined);
    });
  });

  describe('Any type', () => {
    it('should should accept any value', () => {
      typeCheckPass(PropTypes.any, 0);
      typeCheckPass(PropTypes.any, 'str');
      typeCheckPass(PropTypes.any, []);
      typeCheckPass(PropTypes.any, Symbol());
    });

    it('should be implicitly optional and not warn without values', () => {
      typeCheckPass(PropTypes.any, null);
      typeCheckPass(PropTypes.any, undefined);
    });

    it('should warn for missing required values', () => {
      typeCheckFailRequiredValues(PropTypes.any.isRequired);
    });

    it('should warn if called manually in development', () => {
      spyOn(console, 'error');
      expectThrowsInDevelopment(PropTypes.any, null);
      expectThrowsInDevelopment(PropTypes.any.isRequired, null);
      expectThrowsInDevelopment(PropTypes.any.isRequired, undefined);
    });
  });

  describe('ArrayOf Type', () => {
    it('should fail for invalid argument', () => {
      typeCheckFail(
        PropTypes.arrayOf({foo: PropTypes.string}),
        {foo: 'bar'},
        'Property `testProp` of component `testComponent` has invalid PropType notation inside arrayOf.',
      );
    });

    it('should support the arrayOf propTypes', () => {
      typeCheckPass(PropTypes.arrayOf(PropTypes.number), [1, 2, 3]);
      typeCheckPass(PropTypes.arrayOf(PropTypes.string), ['a', 'b', 'c']);
      typeCheckPass(PropTypes.arrayOf(PropTypes.oneOf(['a', 'b'])), ['a', 'b']);
      typeCheckPass(PropTypes.arrayOf(PropTypes.symbol), [Symbol(), Symbol()]);
    });

    it('should support arrayOf with complex types', () => {
      typeCheckPass(
        PropTypes.arrayOf(PropTypes.shape({a: PropTypes.number.isRequired})),
        [{a: 1}, {a: 2}],
      );

      function Thing() {}
      typeCheckPass(PropTypes.arrayOf(PropTypes.instanceOf(Thing)), [
        new Thing(),
        new Thing(),
      ]);
    });

    it('should warn with invalid items in the array', () => {
      typeCheckFail(
        PropTypes.arrayOf(PropTypes.number),
        [1, 2, 'b'],
        'Invalid prop `testProp[2]` of type `string` supplied to ' +
          '`testComponent`, expected `number`.',
      );
    });

    it('should warn with invalid complex types', () => {
      function Thing() {}
      var name = Thing.name || '<<anonymous>>';

      typeCheckFail(
        PropTypes.arrayOf(PropTypes.instanceOf(Thing)),
        [new Thing(), 'xyz'],
        'Invalid prop `testProp[1]` of type `String` supplied to ' +
          '`testComponent`, expected instance of `' +
          name +
          '`.',
      );
    });

    it('should warn when passed something other than an array', () => {
      typeCheckFail(
        PropTypes.arrayOf(PropTypes.number),
        {'0': 'maybe-array', length: 1},
        'Invalid prop `testProp` of type `object` supplied to ' +
          '`testComponent`, expected an array.',
      );
      typeCheckFail(
        PropTypes.arrayOf(PropTypes.number),
        123,
        'Invalid prop `testProp` of type `number` supplied to ' +
          '`testComponent`, expected an array.',
      );
      typeCheckFail(
        PropTypes.arrayOf(PropTypes.number),
        'string',
        'Invalid prop `testProp` of type `string` supplied to ' +
          '`testComponent`, expected an array.',
      );
    });

    it('should not warn when passing an empty array', () => {
      typeCheckPass(PropTypes.arrayOf(PropTypes.number), []);
    });

    it('should be implicitly optional and not warn without values', () => {
      typeCheckPass(PropTypes.arrayOf(PropTypes.number), null);
      typeCheckPass(PropTypes.arrayOf(PropTypes.number), undefined);
    });

    it('should warn for missing required values', () => {
      typeCheckFailRequiredValues(
        PropTypes.arrayOf(PropTypes.number).isRequired,
      );
    });

    it('should warn if called manually in development', () => {
      spyOn(console, 'error');
      expectThrowsInDevelopment(PropTypes.arrayOf({foo: PropTypes.string}), {
        foo: 'bar',
      });
      expectThrowsInDevelopment(PropTypes.arrayOf(PropTypes.number), [
        1,
        2,
        'b',
      ]);
      expectThrowsInDevelopment(PropTypes.arrayOf(PropTypes.number), {
        '0': 'maybe-array',
        length: 1,
      });
      expectThrowsInDevelopment(
        PropTypes.arrayOf(PropTypes.number).isRequired,
        null,
      );
      expectThrowsInDevelopment(
        PropTypes.arrayOf(PropTypes.number).isRequired,
        undefined,
      );
    });
  });

  describe('Component Type', () => {

    it('should support components', () => {
      typeCheckPass(PropTypes.element, <div />);
    });

    it('should not support multiple components or scalar values', () => {
      typeCheckFail(
        PropTypes.element,
        [<div />, <div />],
        'Invalid prop `testProp` of type `array` supplied to `testComponent`, ' +
          'expected a single ReactElement.',
      );
      typeCheckFail(
        PropTypes.element,
        123,
        'Invalid prop `testProp` of type `number` supplied to `testComponent`, ' +
          'expected a single ReactElement.',
      );
      typeCheckFail(
        PropTypes.element,
        'foo',
        'Invalid prop `testProp` of type `string` supplied to `testComponent`, ' +
          'expected a single ReactElement.',
      );
      typeCheckFail(
        PropTypes.element,
        false,
        'Invalid prop `testProp` of type `boolean` supplied to `testComponent`, ' +
          'expected a single ReactElement.',
      );
    });

    it('should be implicitly optional and not warn without values', () => {
      typeCheckPass(PropTypes.element, null);
      typeCheckPass(PropTypes.element, undefined);
    });

    it('should warn for missing required values', () => {
      typeCheckFailRequiredValues(PropTypes.element.isRequired);
    });

    it('should warn if called manually in development', () => {
      spyOn(console, 'error');
      expectThrowsInDevelopment(PropTypes.element, [<div />, <div />]);
      expectThrowsInDevelopment(PropTypes.element, <div />);
      expectThrowsInDevelopment(PropTypes.element, 123);
      expectThrowsInDevelopment(PropTypes.element, 'foo');
      expectThrowsInDevelopment(PropTypes.element, false);
      expectThrowsInDevelopment(PropTypes.element.isRequired, null);
      expectThrowsInDevelopment(PropTypes.element.isRequired, undefined);
    });
  });

  describe('Instance Types', () => {
    it('should warn for invalid instances', () => {
      function Person() {}
      function Cat() {}
      var personName = Person.name || '<<anonymous>>';
      var dateName = Date.name || '<<anonymous>>';
      var regExpName = RegExp.name || '<<anonymous>>';

      typeCheckFail(
        PropTypes.instanceOf(Person),
        false,
        'Invalid prop `testProp` of type `Boolean` supplied to ' +
          '`testComponent`, expected instance of `' +
          personName +
          '`.',
      );
      typeCheckFail(
        PropTypes.instanceOf(Person),
        {},
        'Invalid prop `testProp` of type `Object` supplied to ' +
          '`testComponent`, expected instance of `' +
          personName +
          '`.',
      );
      typeCheckFail(
        PropTypes.instanceOf(Person),
        '',
        'Invalid prop `testProp` of type `String` supplied to ' +
          '`testComponent`, expected instance of `' +
          personName +
          '`.',
      );
      typeCheckFail(
        PropTypes.instanceOf(Date),
        {},
        'Invalid prop `testProp` of type `Object` supplied to ' +
          '`testComponent`, expected instance of `' +
          dateName +
          '`.',
      );
      typeCheckFail(
        PropTypes.instanceOf(RegExp),
        {},
        'Invalid prop `testProp` of type `Object` supplied to ' +
          '`testComponent`, expected instance of `' +
          regExpName +
          '`.',
      );
      typeCheckFail(
        PropTypes.instanceOf(Person),
        new Cat(),
        'Invalid prop `testProp` of type `Cat` supplied to ' +
          '`testComponent`, expected instance of `' +
          personName +
          '`.',
      );
      typeCheckFail(
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

      typeCheckPass(PropTypes.instanceOf(Person), new Person());
      typeCheckPass(PropTypes.instanceOf(Person), new Engineer());

      typeCheckPass(PropTypes.instanceOf(Date), new Date());
      typeCheckPass(PropTypes.instanceOf(RegExp), /please/);
    });

    it('should be implicitly optional and not warn without values', () => {
      typeCheckPass(PropTypes.instanceOf(String), null);
      typeCheckPass(PropTypes.instanceOf(String), undefined);
    });

    it('should warn for missing required values', () => {
      typeCheckFailRequiredValues(PropTypes.instanceOf(String).isRequired);
    });

    it('should warn if called manually in development', () => {
      spyOn(console, 'error');
      expectThrowsInDevelopment(PropTypes.instanceOf(Date), {});
      expectThrowsInDevelopment(PropTypes.instanceOf(Date), new Date());
      expectThrowsInDevelopment(PropTypes.instanceOf(Date).isRequired, {});
      expectThrowsInDevelopment(
        PropTypes.instanceOf(Date).isRequired,
        new Date(),
      );
    });
  });

  describe('React Component Types', () => {
    it('should warn for invalid values', () => {
      var failMessage = 'Invalid prop `testProp` supplied to ' +
        '`testComponent`, expected a ReactNode.';
      typeCheckFail(PropTypes.node, true, failMessage);
      typeCheckFail(PropTypes.node, function() {}, failMessage);
      typeCheckFail(PropTypes.node, {key: function() {}}, failMessage);
      typeCheckFail(PropTypes.node, {key: <div />}, failMessage);
    });

    it('should not warn for valid values', () => {
      function MyComponent() {}
      MyComponent.prototype.render = function() {
        return <div />;
      };
      typeCheckPass(PropTypes.node, <div />);
      typeCheckPass(PropTypes.node, false);
      typeCheckPass(PropTypes.node, <MyComponent />);
      typeCheckPass(PropTypes.node, 'Some string');
      typeCheckPass(PropTypes.node, []);
      typeCheckPass(PropTypes.node, [
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
      var iterable = {
        '@@iterator': function() {
          var i = 0;
          return {
            next: function() {
              var done = ++i > 2;
              return {value: done ? undefined : <MyComponent />, done: done};
            },
          };
        },
      };

      typeCheckPass(PropTypes.node, iterable);
    });

    it('should not warn for entry iterables', () => {
      function MyComponent() {}
      MyComponent.prototype.render = function() {
        return <div />;
      };
      var iterable = {
        '@@iterator': function() {
          var i = 0;
          return {
            next: function() {
              var done = ++i > 2;
              return {
                value: done ? undefined : ['#' + i, <MyComponent />],
                done: done,
              };
            },
          };
        },
      };
      iterable.entries = iterable['@@iterator'];

      typeCheckPass(PropTypes.node, iterable);
    });

    it('should not warn for null/undefined if not required', () => {
      typeCheckPass(PropTypes.node, null);
      typeCheckPass(PropTypes.node, undefined);
    });

    it('should warn for missing required values', () => {
      typeCheckFailRequiredValues(PropTypes.node.isRequired);
    });

    it('should accept empty array for required props', () => {
      typeCheckPass(PropTypes.node.isRequired, []);
    });

    it('should warn if called manually in development', () => {
      spyOn(console, 'error');
      expectThrowsInDevelopment(PropTypes.node, 'node');
      expectThrowsInDevelopment(PropTypes.node, {});
      expectThrowsInDevelopment(PropTypes.node.isRequired, 'node');
      expectThrowsInDevelopment(PropTypes.node.isRequired, undefined);
      expectThrowsInDevelopment(PropTypes.node.isRequired, undefined);
    });
  });

  describe('ObjectOf Type', () => {
    it('should fail for invalid argument', () => {
      typeCheckFail(
        PropTypes.objectOf({foo: PropTypes.string}),
        {foo: 'bar'},
        'Property `testProp` of component `testComponent` has invalid PropType notation inside objectOf.',
      );
    });

    it('should support the objectOf propTypes', () => {
      typeCheckPass(PropTypes.objectOf(PropTypes.number), {a: 1, b: 2, c: 3});
      typeCheckPass(PropTypes.objectOf(PropTypes.string), {
        a: 'a',
        b: 'b',
        c: 'c',
      });
      typeCheckPass(PropTypes.objectOf(PropTypes.oneOf(['a', 'b'])), {
        a: 'a',
        b: 'b',
      });
      typeCheckPass(PropTypes.objectOf(PropTypes.symbol), {
        a: Symbol(),
        b: Symbol(),
        c: Symbol(),
      });
    });

    it('should support objectOf with complex types', () => {
      typeCheckPass(
        PropTypes.objectOf(PropTypes.shape({a: PropTypes.number.isRequired})),
        {a: {a: 1}, b: {a: 2}},
      );

      function Thing() {}
      typeCheckPass(PropTypes.objectOf(PropTypes.instanceOf(Thing)), {
        a: new Thing(),
        b: new Thing(),
      });
    });

    it('should warn with invalid items in the object', () => {
      typeCheckFail(
        PropTypes.objectOf(PropTypes.number),
        {a: 1, b: 2, c: 'b'},
        'Invalid prop `testProp.c` of type `string` supplied to `testComponent`, ' +
          'expected `number`.',
      );
    });

    it('should warn with invalid complex types', () => {
      function Thing() {}
      var name = Thing.name || '<<anonymous>>';

      typeCheckFail(
        PropTypes.objectOf(PropTypes.instanceOf(Thing)),
        {a: new Thing(), b: 'xyz'},
        'Invalid prop `testProp.b` of type `String` supplied to ' +
          '`testComponent`, expected instance of `' +
          name +
          '`.',
      );
    });

    it('should warn when passed something other than an object', () => {
      typeCheckFail(
        PropTypes.objectOf(PropTypes.number),
        [1, 2],
        'Invalid prop `testProp` of type `array` supplied to ' +
          '`testComponent`, expected an object.',
      );
      typeCheckFail(
        PropTypes.objectOf(PropTypes.number),
        123,
        'Invalid prop `testProp` of type `number` supplied to ' +
          '`testComponent`, expected an object.',
      );
      typeCheckFail(
        PropTypes.objectOf(PropTypes.number),
        'string',
        'Invalid prop `testProp` of type `string` supplied to ' +
          '`testComponent`, expected an object.',
      );
      typeCheckFail(
        PropTypes.objectOf(PropTypes.symbol),
        Symbol(),
        'Invalid prop `testProp` of type `symbol` supplied to ' +
          '`testComponent`, expected an object.',
      );
    });

    it('should not warn when passing an empty object', () => {
      typeCheckPass(PropTypes.objectOf(PropTypes.number), {});
    });

    it('should be implicitly optional and not warn without values', () => {
      typeCheckPass(PropTypes.objectOf(PropTypes.number), null);
      typeCheckPass(PropTypes.objectOf(PropTypes.number), undefined);
    });

    it('should warn for missing required values', () => {
      typeCheckFailRequiredValues(
        PropTypes.objectOf(PropTypes.number).isRequired,
      );
    });

    it('should warn if called manually in development', () => {
      spyOn(console, 'error');
      expectThrowsInDevelopment(PropTypes.objectOf({foo: PropTypes.string}), {
        foo: 'bar',
      });
      expectThrowsInDevelopment(PropTypes.objectOf(PropTypes.number), {
        a: 1,
        b: 2,
        c: 'b',
      });
      expectThrowsInDevelopment(PropTypes.objectOf(PropTypes.number), [1, 2]);
      expectThrowsInDevelopment(PropTypes.objectOf(PropTypes.number), null);
      expectThrowsInDevelopment(
        PropTypes.objectOf(PropTypes.number),
        undefined,
      );
    });
  });

  describe('OneOf Types', () => {
    it('should warn but not error for invalid argument', () => {
      spyOn(console, 'error');

      PropTypes.oneOf('red', 'blue');

      expect(console.error).toHaveBeenCalled();
      expect(console.error.calls.argsFor(0)[0]).toContain(
        'Invalid argument supplied to oneOf, expected an instance of array.',
      );

      typeCheckPass(PropTypes.oneOf('red', 'blue'), 'red');
    });

    it('should warn for invalid values', () => {
      typeCheckFail(
        PropTypes.oneOf(['red', 'blue']),
        true,
        'Invalid prop `testProp` of value `true` supplied to ' +
          '`testComponent`, expected one of ["red","blue"].',
      );
      typeCheckFail(
        PropTypes.oneOf(['red', 'blue']),
        [],
        'Invalid prop `testProp` of value `` supplied to `testComponent`, ' +
          'expected one of ["red","blue"].',
      );
      typeCheckFail(
        PropTypes.oneOf(['red', 'blue']),
        '',
        'Invalid prop `testProp` of value `` supplied to `testComponent`, ' +
          'expected one of ["red","blue"].',
      );
      typeCheckFail(
        PropTypes.oneOf([0, 'false']),
        false,
        'Invalid prop `testProp` of value `false` supplied to ' +
          '`testComponent`, expected one of [0,"false"].',
      );
    });

    it('should not warn for valid values', () => {
      typeCheckPass(PropTypes.oneOf(['red', 'blue']), 'red');
      typeCheckPass(PropTypes.oneOf(['red', 'blue']), 'blue');
      typeCheckPass(PropTypes.oneOf(['red', 'blue', NaN]), NaN);
    });

    it('should be implicitly optional and not warn without values', () => {
      typeCheckPass(PropTypes.oneOf(['red', 'blue']), null);
      typeCheckPass(PropTypes.oneOf(['red', 'blue']), undefined);
    });

    it('should warn for missing required values', () => {
      typeCheckFailRequiredValues(PropTypes.oneOf(['red', 'blue']).isRequired);
    });

    it('should warn if called manually in development', () => {
      spyOn(console, 'error');
      expectThrowsInDevelopment(PropTypes.oneOf(['red', 'blue']), true);
      expectThrowsInDevelopment(PropTypes.oneOf(['red', 'blue']), null);
      expectThrowsInDevelopment(PropTypes.oneOf(['red', 'blue']), undefined);
    });
  });

  describe('Union Types', () => {
    it('should warn but not error for invalid argument', () => {
      spyOn(console, 'error');

      PropTypes.oneOfType(PropTypes.string, PropTypes.number);

      expect(console.error).toHaveBeenCalled();
      expect(console.error.calls.argsFor(0)[0]).toContain(
        'Invalid argument supplied to oneOfType, expected an instance of array.',
      );

      typeCheckPass(PropTypes.oneOf(PropTypes.string, PropTypes.number), []);
    });

    it('should warn but for invalid argument type', () => {
      spyOn(console, 'error');

      var types = [undefined, null, false, new Date, /foo/, {}];
      var expected = ['undefined', 'null', 'a boolean', 'a date', 'a regexp', 'an object'];

      for (var i = 0; i < expected.length; i++) {
        var type = types[i];
        PropTypes.oneOfType([type]);
        expect(console.error).toHaveBeenCalled();
        expect(console.error.calls.argsFor(0)[0]).toContain(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, ' +
          'but received ' + expected[i] + ' at index 0.'
        );
        console.error.calls.reset();
      }

      typeCheckPass(PropTypes.oneOf(PropTypes.string, PropTypes.number), []);
    });

    it('should warn if none of the types are valid', () => {
      typeCheckFail(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        [],
        'Invalid prop `testProp` supplied to `testComponent`.',
      );

      var checker = PropTypes.oneOfType([
        PropTypes.shape({a: PropTypes.number.isRequired}),
        PropTypes.shape({b: PropTypes.number.isRequired}),
      ]);
      typeCheckFail(
        checker,
        {c: 1},
        'Invalid prop `testProp` supplied to `testComponent`.',
      );
    });

    it('should not warn if one of the types are valid', () => {
      var checker = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
      typeCheckPass(checker, null);
      typeCheckPass(checker, 'foo');
      typeCheckPass(checker, 123);

      checker = PropTypes.oneOfType([
        PropTypes.shape({a: PropTypes.number.isRequired}),
        PropTypes.shape({b: PropTypes.number.isRequired}),
      ]);
      typeCheckPass(checker, {a: 1});
      typeCheckPass(checker, {b: 1});
    });

    it('should be implicitly optional and not warn without values', () => {
      typeCheckPass(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        null,
      );
      typeCheckPass(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        undefined,
      );
    });

    it('should warn for missing required values', () => {
      typeCheckFailRequiredValues(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      );
    });

    it('should warn if called manually in development', () => {
      spyOn(console, 'error');
      expectThrowsInDevelopment(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        [],
      );
      expectThrowsInDevelopment(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        null,
      );
      expectThrowsInDevelopment(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        undefined,
      );
    });
  });

  describe('Shape Types', () => {
    it('should warn for non objects', () => {
      typeCheckFail(
        PropTypes.shape({}),
        'some string',
        'Invalid prop `testProp` of type `string` supplied to ' +
          '`testComponent`, expected `object`.',
      );
      typeCheckFail(
        PropTypes.shape({}),
        ['array'],
        'Invalid prop `testProp` of type `array` supplied to ' +
          '`testComponent`, expected `object`.',
      );
    });

    it('should not warn for empty values', () => {
      typeCheckPass(PropTypes.shape({}), undefined);
      typeCheckPass(PropTypes.shape({}), null);
      typeCheckPass(PropTypes.shape({}), {});
    });

    it('should not warn for an empty object', () => {
      typeCheckPass(PropTypes.shape({}).isRequired, {});
    });

    it('should not warn for non specified types', () => {
      typeCheckPass(PropTypes.shape({}), {key: 1});
    });

    it('should not warn for valid types', () => {
      typeCheckPass(PropTypes.shape({key: PropTypes.number}), {key: 1});
    });

    it('should warn for required valid types', () => {
      typeCheckFail(
        PropTypes.shape({key: PropTypes.number.isRequired}),
        {},
        'The prop `testProp.key` is marked as required in `testComponent`, ' +
          'but its value is `undefined`.',
      );
    });

    it('should warn for the first required type', () => {
      typeCheckFail(
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
      typeCheckFail(
        PropTypes.shape({key: PropTypes.number}),
        {key: 'abc'},
        'Invalid prop `testProp.key` of type `string` supplied to `testComponent`, ' +
          'expected `number`.',
      );
    });

    it('should be implicitly optional and not warn without values', () => {
      typeCheckPass(
        PropTypes.shape(PropTypes.shape({key: PropTypes.number})),
        null,
      );
      typeCheckPass(
        PropTypes.shape(PropTypes.shape({key: PropTypes.number})),
        undefined,
      );
    });

    it('should warn for missing required values', () => {
      typeCheckFailRequiredValues(
        PropTypes.shape({key: PropTypes.number}).isRequired,
      );
    });

    it('should warn if called manually in development', () => {
      spyOn(console, 'error');
      expectThrowsInDevelopment(PropTypes.shape({}), 'some string');
      expectThrowsInDevelopment(PropTypes.shape({foo: PropTypes.number}), {
        foo: 42,
      });
      expectThrowsInDevelopment(
        PropTypes.shape({key: PropTypes.number}).isRequired,
        null,
      );
      expectThrowsInDevelopment(
        PropTypes.shape({key: PropTypes.number}).isRequired,
        undefined,
      );
      expectThrowsInDevelopment(PropTypes.element, <div />);
    });
  });

  describe('Symbol Type', () => {
    it('should warn for non-symbol', () => {
      typeCheckFail(
        PropTypes.symbol,
        'hello',
        'Invalid prop `testProp` of type `string` supplied to ' +
          '`testComponent`, expected `symbol`.',
      );
      typeCheckFail(
        PropTypes.symbol,
        function() {},
        'Invalid prop `testProp` of type `function` supplied to ' +
          '`testComponent`, expected `symbol`.',
      );
      typeCheckFail(
        PropTypes.symbol,
        {
          '@@toStringTag': 'Katana',
        },
        'Invalid prop `testProp` of type `object` supplied to ' +
          '`testComponent`, expected `symbol`.',
      );
    });

    it('should not warn for a polyfilled Symbol', () => {
      var CoreSymbol = require('core-js/library/es6/symbol');
      typeCheckPass(PropTypes.symbol, CoreSymbol('core-js'));
    });
  });
});
