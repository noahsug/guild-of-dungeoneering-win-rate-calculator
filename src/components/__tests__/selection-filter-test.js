jest.unmock('../SelectionList/selection-filter')

import _ from '../../utils'
import { filterSelections } from '../SelectionList/selection-filter'

const selections = [
  { cards: ['P', 'P/P', 'BM/M/M'] },
  { cards: ['P', 'P', 'M'] },
  { cards: ['P', 'B', 'B'] },
  { cards: ['P/P/M/M', 'P/U', 'B'] },
  { cards: ['BM/M/M', 'B', 'B'] },
]

function expectSelections(actual, expected) {
  expect(actual.length).toBe(expected.length)
  _.each(actual, ((actualSelection, i) => {
    expect(actualSelection).toEqualValues(expected[i])
  }))
}

describe('selection filter', () => {
  it('includes all selections when no filter is empty', () => {
    const filtered = filterSelections(selections, '')
    expectSelections(filtered, selections)
  })

  it('excludes non-matching selections', () => {
    const filtered = filterSelections(selections, 'P/P')
    const expected = [selections[0], selections[3]]
    expectSelections(filtered, expected)
  })

  fit('ignores case and leading and trailer spaces and slashes', () => {
    const filtered = filterSelections(selections, ' p/')
    const expected = selections.slice(0, 4)
    expectSelections(filtered, expected)
  })

  it('matches each filter card to a unique card', () => {
    const filtered = filterSelections(selections, 'P P')
    const expected = [selections[0], selections[1], selections[3]]
    expectSelections(filtered, expected)
  })
})
