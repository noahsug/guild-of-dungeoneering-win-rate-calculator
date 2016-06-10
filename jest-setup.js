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
};

jasmine.getEnv().beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});

//const utilMatchers = {
//    toBeBetween: function(a, b) {
//      return this.actual >= a && this.actual <= b;
//    },
//
//    toContainKeys: function(keys) {
//      var diff = _.difference(keys, Object.keys(this.actual));
//      if (diff.length) {
//        return false;
//      }
//      return true;
//    },
//
//    toContainKVs: function(kvs) {
//      return _.every(kvs, (v, k) => {
//        return this.actual.hasOwnProperty(k) && this.actual[k] === v;
//      });
//    },
//
//    toEqualValues: function(values) {
//      return _.valuesEqual(this.actual, values);
//    },
//
//    toContainValues: function(values) {
//      return _.difference(_.values(values), _.values(this.actual)).length == 0;
//    },
//
//    toEventuallyBe: function(value) {
//      for (let i = 0; i < 1000; i++) {
//        if (this.actual() == value) return true;
//      }
//      return false;
//    },
//
//    toEventuallyEqual: function(value) {
//      for (let i = 0; i < 1000; i++) {
//        if (_.isEqual(this.actual(), value)) return true;
//      }
//      return false;
//    },
//
//    toContainValidValue: function(isValid) {
//      return _.some(this.actual, (v, k) => {
//        return isValid(v, k);
//      });
//    },
//
//    toContainOnlyValidValues: function(isValid) {
//      return _.every(this.actual, (v, k) => {
//        return isValid(v, k);
//      });
//    },
//  });
//});
