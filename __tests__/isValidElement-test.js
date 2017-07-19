'use strict';

var React = require('react');
var isValidElement = require('../isValidElement');

describe('isValidElement', () => {
  class Component extends React.Component {
    render() {
      return <div />;
    }
  }

  function SFC() {
    return <div />;
  }

  it('should support components', () => {
    expect(isValidElement(<div />)).toBe(true);
    expect(isValidElement(<Component />)).toBe(true);
    expect(isValidElement(<SFC />)).toBe(true);
  });

  it('should not support multiple components or scalar values', () => {
    expect(isValidElement([<div />, <div />])).toBe(false);
    expect(isValidElement(123)).toBe(false);
    expect(isValidElement('foo')).toBe(false);
    expect(isValidElement(false)).toBe(false);
    expect(isValidElement(null)).toBe(false);
    expect(isValidElement(undefined)).toBe(false);
  });
});
