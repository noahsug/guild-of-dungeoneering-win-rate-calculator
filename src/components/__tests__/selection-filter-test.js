jest.unmock('../SelectionList/selection-filter')

import _ from '../../utils'
import { filterSelections } from '../SelectionList/selection-filter'

let selections;

function expectSelections(actual, expected) {
  expect(actual.length).toBe(expected.length)
  _.each(actual, ((actualSelection, i) => {
    expect(actualSelection).toEqualValues(expected[i])
  }))
}

describe('selection filter', () => {
  beforeEach(() => {
    selections = [
      { cards: ['P', 'P/P', 'BM/M/M'] },
      { cards: ['P', 'P', 'M'] },
      { cards: ['P', 'B', 'B'] },
      { cards: ['P/P/M/M', 'P/U', 'B'] },
      { cards: ['BM/M/M', 'B', 'B'] },
    ]
  })

  it('includes all selections when no filter is empty', () => {
    const filtered = filterSelections(selections, '')
    expectSelections(filtered, selections)
  })

  it('excludes non-matching selections', () => {
    const filtered = filterSelections(selections, 'P/P')
    const expected = _.select(selections, 0, 3)
    expectSelections(filtered, expected)
  })

  it('ignores case and leading and trailer spaces and slashes', () => {
    const filtered = filterSelections(selections, ' p/')
    const expected = selections.slice(0, 4)
    expectSelections(filtered, expected)
  })

  it('matches each filter card to a unique card', () => {
    const filtered = filterSelections(selections, 'P P')
    const expected = _.select(selections, 0, 1, 3)
    expectSelections(filtered, expected)
  })

  it('filters c in Cs', () => {
    selections = [
      { cards: ['BM/M/M', 'Cs', 'D/H'] },
      { cards: ['BM/M/M', 'Cs', 'Ps'] },
      { cards: ['D/H', 'Ps', 'P/Q/U'] },
    ]
    const filtered = filterSelections(selections, 'p ps')
    expectSelections(filtered, selections.slice(2))
  })

  it('falls back to simple text match', () => {
    const filtered = filterSelections(selections, 'ppmm')
    expectSelections(filtered, _.select(selections, 0, 3))
  })
})
