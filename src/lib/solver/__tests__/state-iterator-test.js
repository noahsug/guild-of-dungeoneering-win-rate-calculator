jest.unmock('../state-iterator')

import _ from '../../../utils'
import stateIterator from '../state-iterator'

function createChildren(...ids) {
  return ids.map(id => ({ id }))
}

describe('state iterator', () => {
  it('creates children', () => {
    const state = { depth: -1 }
    const children = createChildren(1, 2, 3)
    stateIterator.initState(state, children)
    expect(state.children.length).toBe(3)
  })

  it('creates unique weighted children', () => {
    const state = { depth: -1 }
    const children = createChildren(1, 1, 2, 3)
    stateIterator.initState(state, children)

    expect(state.children.length).toBe(3)
    expect(state.children.find(c => c.id === 1).weight).toBe(2)
    expect(state.children.find(c => c.id === 2).weight).toBe(1)
    expect(state.children.find(c => c.id === 3).weight).toBe(1)
  })

  it('creates a list of children to iterate over', () => {
    const state = { depth: -1 }
    const children = createChildren(1, 2, 2, 3, 3, 3)
    stateIterator.initState(state, children)

    const ids = _.pluck(state.iterableChildren, 'id')
    expect(ids).toEqual([1, 2, 3, 3])
    state.iterableChildren.forEach(c => {
      expect(c.depth).toBe(0)
    })
  })

  it('iterates over children', () => {
    const state = { depth: -1 }
    const children = createChildren(1, 2, 2, 3, 3, 3)
    stateIterator.initState(state, children)

    expect(stateIterator.getNextState(state).id).toBe(1)
    expect(stateIterator.getNextState(state).id).toBe(2)
    expect(stateIterator.getNextState(state).id).toBe(3)
    expect(stateIterator.getNextState(state).id).toBe(3)
    expect(stateIterator.getNextState(state).id).toBeOneOf(1, 2, 3)
  })
})
