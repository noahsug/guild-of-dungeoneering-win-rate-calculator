jest.unmock('../results')

import _ from '../../../utils'
import Results from '../results'

let results
const states = _.range(3).map(s => ({ id: s }))

describe('results', () => {
  beforeEach(() => {
    results = new Results()
    results.states = states
  })

  it('gets overall results', () => {
    expect(results.getResult()).toBeNaN()
    results.recordResult(states[0], 0, 1)
    results.recordResult(states[1], 0, 0)
    results.recordResult(states[0], 0, 2)
    expect(results.getResult()).toBe(2 / 3)
  })

  it('gets state results', () => {
    results.recordResult(states[0], 0, 1)
    results.recordResult(states[1], 0, 0)
    results.recordResult(states[0], 0, 2)
    expect(results.getResult(states[0])).toBe(1)
    expect(results.getResult(states[1])).toBe(0)
    expect(results.getResult(states[2])).toBeNaN()
  })

  it('gets enemy card results', () => {
    results.recordResult(states[0], 0, 1)
    results.recordResult(states[0], 0, 0)
    results.recordResult(states[0], 1, 2)
    expect(results.getResult(states[0], 0)).toBe(0.5)
    expect(results.getResult(states[0], 1)).toBe(1)
    expect(results.getResult(states[0], 2)).toBeNaN()
  })

  it('gets hero card results', () => {
    results.recordResult(states[0], 0, 1)
    results.recordResult(states[0], 0, 0)
    results.recordResult(states[0], 0, 2)
    results.recordResult(states[0], 0, 2)
    expect(results.getResult(states[0], 0, 1)).toBe(0.75 / 2)
    expect(results.getResult(states[0], 0, 2)).toBe(0.75)
    expect(results.getResult(states[0], 0, 3)).toBe(0)
  })

  it('accounts for best move pruning', () => {
    results.bestMovePruning = 2
    results.recordResult(states[0], 0, 1)
    results.recordResult(states[0], 0, 0)
    results.recordResult(states[0], 0, 2)
    results.recordResult(states[0], 0, 2)
    results.recordResult(states[0], 0, 2)
    expect(results.getResult(states[0], 0, 1)).toBe(0.4)
    expect(results.getResult(states[0], 0, 2)).toBe(0.8)
    expect(results.getResult(states[0], 0, 3)).toBe(0)
  })
})
