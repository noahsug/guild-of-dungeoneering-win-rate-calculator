jest.unmock('../results')

import _ from '../../../utils'
import Results from '../results'

let results
const states = _.range(3).map(s => ({ id: s }))

describe('results', () => {
  beforeEach(() => {
    results = new Results()
    results.bestMoveAccuracy = 3
  })

  it('gets overall results', () => {
    results.recordResult(states[0], 0, 1)
    results.recordResult(states[1], 0, 0)
    results.recordResult(states[0], 0, 2)
    expect(results.getResult()).toBe(2 / 3)
  })

  xit('gets state results', () => {
    results.recordResult(states[0], 0, 1)
    results.recordResult(states[1], 0, 0)
    results.recordResult(states[0], 0, 2)
    expect(results.getResult(states[0])).toBe(1)
    expect(results.getResult(states[1])).toBe(0)
  })
})
