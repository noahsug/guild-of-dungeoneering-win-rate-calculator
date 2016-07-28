import _ from './src/utils';


/* Mocks */

window.crypto = {
  getRandomValues: function(array) {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.random() * Math.pow(2, 32);
    }
  }
};

window.performance = {
  now: function() { return Date.now(); },
};


/* Custom matchers */

const basicMatcher = (passes, passesNegative) => () => {
  const matcher = {
    compare: (actual, expected, ...args) => ({
      pass: passes(actual, expected, ...args)
    })
  }
  if (passesNegative) {
    matcher.negativeCompare = (actual, expected, ...args) => ({
      pass: passesNegative(actual, expected, ...args)
    })
  }
  return matcher;
};

const customMatchers = {
  toSortedEqual: basicMatcher((actual, expected) => (
    _.valuesEqual(actual, expected)
  )),

  toEqualValues: basicMatcher((actual, expected) => (
    _.valuesEqual(actual, expected)
  )),

  toBeBetween: basicMatcher((actual, a, b) => (
    a <= actual && actual <= b
  )),

  toBeAround: basicMatcher((actual, expected, fudge) => (
    expected - fudge <= actual && actual <= expected + fudge
  )),

  toHaveKey: basicMatcher((actual, expected) => (
    _.isDef(actual[expected])
  )),

  toBeEmpty: basicMatcher((actual) => (
    actual && actual.length === 0
  ), (actual) => (
    actual && actual.length > 0
  )),

  toEventuallyBe: basicMatcher((actual, expected) => (
    _.some(_.range(1000), () => actual() === expected)
  ), (actual, expected) => (
    _.every(_.range(100), () => actual() !== expected)
  )),

  toBeOneOf: basicMatcher((actual, ...expected) => (
    expected.includes(actual)
  )),
};

jasmine.getEnv().beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});
