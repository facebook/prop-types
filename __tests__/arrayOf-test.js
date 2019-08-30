const testInAllEnvironments = require('./environmentsTesters');

function makeTests({ getModules, expectPass, expectFail, expectFailRequiredValues, expectWarning }) {
  let React;
  let PropTypes;

  beforeEach(() => {
    ({React, PropTypes} = getModules());
  })

  describe('ArrayOf Type', () => {
    it('should fail for invalid argument', () => {
      expectFail(
        PropTypes.arrayOf({ foo: PropTypes.string }),
        { foo: 'bar' },
        'Property `testProp` of component `testComponent` has invalid PropType notation inside arrayOf.',
      );
    });

    it('should support the arrayOf propTypes', () => {
      expectPass(PropTypes.arrayOf(PropTypes.number), [1, 2, 3]);
      expectPass(PropTypes.arrayOf(PropTypes.string), ['a', 'b', 'c']);
      expectPass(PropTypes.arrayOf(PropTypes.oneOf(['a', 'b'])), ['a', 'b']);
      expectPass(PropTypes.arrayOf(PropTypes.symbol), [Symbol(), Symbol()]);
    });

    it('should support arrayOf with complex types', () => {
      expectPass(
        PropTypes.arrayOf(PropTypes.shape({ a: PropTypes.number.isRequired })),
        [{ a: 1 }, { a: 2 }],
      );

      function Thing() { }
      expectPass(PropTypes.arrayOf(PropTypes.instanceOf(Thing)), [
        new Thing(),
        new Thing(),
      ]);
    });

    it('should warn with invalid items in the array', () => {
      expectFail(
        PropTypes.arrayOf(PropTypes.number),
        [1, 2, 'b'],
        'Invalid prop `testProp[2]` of type `string` supplied to ' +
        '`testComponent`, expected `number`.',
      );
    });

    it('should warn with invalid complex types', () => {
      function Thing() { }
      const name = Thing.name || '<<anonymous>>';

      expectFail(
        PropTypes.arrayOf(PropTypes.instanceOf(Thing)),
        [new Thing(), 'xyz'],
        'Invalid prop `testProp[1]` of type `String` supplied to ' +
        '`testComponent`, expected instance of `' +
        name +
        '`.',
      );
    });

    it('should warn when passed something other than an array', () => {
      expectFail(
        PropTypes.arrayOf(PropTypes.number),
        { '0': 'maybe-array', length: 1 },
        'Invalid prop `testProp` of type `object` supplied to ' +
        '`testComponent`, expected an array.',
      );
      expectFail(
        PropTypes.arrayOf(PropTypes.number),
        123,
        'Invalid prop `testProp` of type `number` supplied to ' +
        '`testComponent`, expected an array.',
      );
      expectFail(
        PropTypes.arrayOf(PropTypes.number),
        'string',
        'Invalid prop `testProp` of type `string` supplied to ' +
        '`testComponent`, expected an array.',
      );
    });

    it('should not warn when passing an empty array', () => {
      expectPass(PropTypes.arrayOf(PropTypes.number), []);
    });

    it('should be implicitly optional and not warn without values', () => {
      expectPass(PropTypes.arrayOf(PropTypes.number), null);
      expectPass(PropTypes.arrayOf(PropTypes.number), undefined);
    });

    it('should warn for missing required values', () => {
      expectFailRequiredValues(
        PropTypes.arrayOf(PropTypes.number).isRequired,
      );
    });

    it('should warn if called manually in development', () => {
      spyOn(console, 'error');
      expectWarning(PropTypes.arrayOf({ foo: PropTypes.string }), {
        foo: 'bar',
      });
      expectWarning(PropTypes.arrayOf(PropTypes.number), [
        1,
        2,
        'b',
      ]);
      expectWarning(PropTypes.arrayOf(PropTypes.number), {
        '0': 'maybe-array',
        length: 1,
      });
      expectWarning(
        PropTypes.arrayOf(PropTypes.number).isRequired,
        null,
      );
      expectWarning(
        PropTypes.arrayOf(PropTypes.number).isRequired,
        undefined,
      );
    });
  });
}

testInAllEnvironments(makeTests)
