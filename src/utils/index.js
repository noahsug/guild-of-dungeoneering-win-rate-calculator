import _ from 'underscore'
import s from 'underscore.string'
import './factorial'
import './simple-moving-average'

let uid = 0
let seed = 0
const time = {}

_.s = s

_.mixin({
  sum: (array, iteratee = _.identity) => (
    array.reduce((p, c) => p + iteratee(c), 0)
  ),

  avg: (array, iteratee = _.identity) => (
    _.sum(array, iteratee) / array.length
  ),

  decimals: (value, numDecimals) => {
    _.assert(numDecimals < 0, `Invalid number of decimals: ${numDecimals}`)
    const magnitude = Math.pow(10, numDecimals)
    return Math.round(value * magnitude) / magnitude
  },

  percent: (ratio, numDecimals = 2) => {
    if (ratio < 0) ratio = 0
    return _.decimals(100 * ratio, numDecimals)
  },

  isDef: (value) => !_.isUndefined(value),

  ifDef: (value, valueWhenUndefined) => (
    _.isDef(value) ? value : valueWhenUndefined
  ),

  // Like _.without, but only removes the first instance of an element.
  // [1, 2, 1], 1 => [2, 1]
  remove: (array, ...values) => {
    const toRemove = {}
    values.forEach((v) => {
      if (!toRemove[v]) toRemove[v] = 0
      toRemove[v]++
    })
    return array.filter((v) => {
      if (toRemove[v]) {
        toRemove[v]--
        return false
      }
      return true
    })
  },

  // Like _.without, but only removes the first instance of elements.
  // [1, 2, 1], [1] => [2, 1]
  removeAll: (array, values) => {
    const toRemove = {}
    values.forEach((v) => {
      if (!toRemove[v]) toRemove[v] = 0
      toRemove[v]++
    })
    return array.filter((v) => {
      if (toRemove[v]) {
        toRemove[v]--
        return false
      }
      return true
    })
  },

  // Fast, but doesn't preserve order.
  fastRemoveAt: (array, index) => {
    const removed = array[index]
    const len = array.length
    array[index] = array[len - 1]
    array.length = len - 1
    return removed
  },

  copyWithoutIndex: (array, index) => {
    const len = array.length - 1
    const array2 = new Array(len)
    for (let i = 0; i < index; i++) {
      array2[i] = array[i]
    }
    for (let i = index; i < len; i++) {
      array2[i] = array[i + 1]
    }
    return array2
  },

  cloneAndPush: (array, value) => {
    const len = array.length
    const array2 = new Array(len + 1)
    for (let i = 0; i < len; i++) {
      array2[i] = array[i]
    }
    array2[len] = value
    return array2
  },

  increment: (obj, key, value = 1) => {
    obj[key] = (obj[key] || 0) + value
    return obj[key]
  },

  // [1, 2, 3], [5, 6], [9] => [[1, 5, 9], [1, 6, 9], [2, 5, 9], ...]
  tuplesCombinationsGenerator: (...arrays) => {
    const result = []
    function* combinate(i) {
      for (let v = 0; v < arrays[i].length; v++) {
        result[i] = arrays[i][v]
        if (i === arrays.length - 1) {
          yield result.slice()
        } else {
          yield* combinate(i + 1)
        }
      }
    }
    return combinate(0)
  },

  // [1, 2, 3], [5, 6] => 6
  numArrayCombinations: (...arrays) => (
    arrays.reduce((prev, current) => prev * current.length, 1)
  ),

  // [1, 2, 3], 2 => [[1, 2], [1, 3], [2, 3]]
  // Note: The yielded result should NOT be modified.
  combinationsGenerator: (array, size) => {
    const result = []
    function* combinate(i, r) {
      if (size >= array.length) {
        yield array
        return
      }
      for (let v = i; v < array.length; v++) {
        result[r] = array[v]
        if (r === size - 1) {
          yield result
        } else {
          yield* combinate(v + 1, r + 1)
        }
      }
    }
    return combinate(0, 0)
  },

  // Iterates through every permutation of an array (order matters).
  // Note: The yielded result should NOT be modified.
  permutate: (list) => {
    function* p(index) {
      if (index === list.length - 1) {
        yield list
      } else {
        p(list, index + 1)
        for (let i = index + 1; i < list.length; i++) {
          _.swap(list, i, index)
          yield* p(list, index + 1)
          _.swap(list, i, index)
        }
      }
    }
    return p(0)
  },

  swap: (list, index1, index2) => {
    const temp = list[index1]
    list[index1] = list[index2]
    list[index2] = temp
  },

  binomialCoefficient: (n, k) => {
    if (n <= k || !k) return 1
    return _.factorial(n) / (_.factorial(n - k) * _.factorial(k))
  },

  // Useful when get() is called way more often then add().
  integerWeightedRandom: () => {
    const indexes = []
    return {
      add: (value, weight) => {
        for (let i = 0; i < weight; i++) indexes.push(value)
      },
      get: () => _.sample(indexes),
    }
  },

  iterator: (...values) => {
    const iterator = (function* iteratorGen() {
      for (let i = 0; i < values.length; i++) yield values[i]
    }())
    iterator.length = values.length
    return iterator
  },

  floatEquals: (f1, f2, epsilon = Number.EPSILON) => (
    Math.abs(f1 - f2) < epsilon
  ),

  // Use _.equals for deep obj comparison.
  arrayEquals: (array1, array2) => {
    if (array1.length !== array2.length) return false
    return array1.every((v, i) => array2[i] === v)
  },

  // Use _.equals for deep obj comparison.
  valuesEqual: (obj1, obj2) => {
    const values1 = _.values(obj1).sort()
    const values2 = _.values(obj2).sort()
    return _.arrayEquals(values1, values2)
  },

  assert: (value, msg) => {
    if (!value) {
      throw new Error(`Assertion failed: ${value === undefined ? msg : value}`)
    }
    return value;
  },

  fail: () => new Error('Assertion failed'),

  count: (list, predicate) => {
    let count = 0
    list.forEach((item) => {
      if (predicate(item)) count++
    })
    return count
  },

  createSet: (list) => {
    const set = {}
    for (let i = 0; i < list.length; i++) {
      set[list[i]] = true
    }
    return set
  },

  expand: (list, fn, context) => (
    _.flatten(list.map(fn.bind(context)), true)
  ),

  anyKey: (obj) => _.keys(obj)[0],

  anyValue: (obj) => _.values(obj)[0],

  uid: () => ++uid,

  emptyFn: () => {},

  shuffleInPlace: (list) => {
    for (let count = list.length - 1; count > 0; count--) {
      const swapIndex = Math.random() * (count + 1) | 0
      const temp = list[count]
      list[count] = list[swapIndex]
      list[swapIndex] = temp
    }
  },

  // Shuffles range of values in place between [startIndex, endIndex);
  shuffleRange: (list, startIndex, endIndex) => {
    for (let count = endIndex - startIndex - 1; count > 0; count--) {
      const index1 = startIndex + count
      const index2 = startIndex + Math.random() * (count + 1) | 0
      const temp = list[index1]
      list[index1] = list[index2]
      list[index2] = temp
    }
  },

  seededRandom: () => {
    const x = Math.sin(seed) * 10000
    seed += 13.3
    return x - Math.floor(x)
  },

  resetSeededRandom: () => {
    seed = 0
  },

  minZero: (number) => Math.max(number, 0),

  // Use array.fill() when filling with a literal value.
  fill: (list, fn) => {
    const len = list.length
    for (let i = 0; i < len; i++) {
      list[i] = fn(i)
    }
  },

  // Creates actualYourFunctionName() function.
  mock: (obj, fnName, fn) => {
    const actual = obj[fnName].bind(obj)
    obj[`actual ${_.s.capitalize(fnName)}`] = actual
    obj[fnName] = fn
  },

  // First call starts the clock, second call returns time elapsed.
  time: (id) => {
    const now = performance.now()
    if (time[id]) {
      const diff = now - time[id]
      delete time[id]
      return diff
    }
    time[id] = now
    return 0
  },
})

export default _
