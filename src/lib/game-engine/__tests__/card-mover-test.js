jest.unmock('../card-mover')
jest.unmock('../game-state')

import CardMover from '../card-mover'
import gs from '../game-state'
import _ from '../../../utils'

let mover

function cardsAreEqual(actual, expected) {
  return _.isEqual(actual.sort(), expected.sort())
}

function hasHand(state, cards) {
  return cardsAreEqual(state.player.hand, cards)
}

function hasDeck(state, cards) {
  return cardsAreEqual(state.player.deck, cards)
}

function hasDiscard(state, cards) {
  return cardsAreEqual(state.player.discard, cards)
}

function hasCards(state, deck, hand, discard) {
  return hasDeck(state, deck) &&
    hasHand(state, hand) &&
    hasDiscard(state, discard)
}

function expectState(states, deck, hand, discard) {
  if (!_.isArray(states)) states = [states]
  expect(_.some(states, (state) => (
    hasCards(state, deck, hand, discard)
  )))
}

function expectEveryState(states, deck, hand, discard) {
  if (!_.isArray(states)) states = [states]
  expect(_.every(states, (state) => (
    hasCards(state, deck, hand, discard)
  )))
}

describe('card mover', () => {
  beforeEach(() => {
    mover = new CardMover()
    const orderValues = [0, 1]
    mover.order = {
      cycleDiscardValues: orderValues,
      cycleDrawValues: orderValues,
      drawValues: orderValues,
      discardValues: orderValues,
      endTurnDrawValues: orderValues,
    }
  })

  it('moves the card played into the discard', () => {
    const state = { player: {
      deck: [1],
      hand: [2],
      discard: [],
    } }
    mover.moveCards(state, 0, 0)
    expectState(state, [], [1], [2])
  })

  it('does nothing when hand is full and no discard effect', () => {
    const state = { player: {
      deck: [],
      hand: [1, 2, 3, 4],
      discard: [],
    } }
    mover.moveCards(state, 0, 0)
    expectState(state, [], [1, 2, 3, 4], [])
  })

  it('cycles cards', () => {
    const state = { player: {
      deck: [1, 2],
      hand: [3, 4],
      discard: [],
      cycleEffect: 1,
    } }

    mover.moveCards(state, 1, 0)
    expectState(state, [], [1, 2], [3, 4])
  })

  it('draws cards', () => {
    const state = { player: {
      deck: [1, 2],
      hand: [3, 4],
      discard: [],
      drawEffect: 2,
    } }

    mover.moveCards(state, 1, 0)
    expectState(state, [], [1, 2, 3, 4], [])
  })

  it('discards cards', () => {
    const state = { player: {
      deck: [1, 2],
      hand: [3, 4],
      discard: [],
      discardEffect: 2,
    } }

    mover.moveCards(state, 1, 0)
    expectState(state, [2], [1], [3, 4])
  })

  it('gets all possible next states', () => {
    const state = gs.create({
      deck: [1, 2],
      hand: [3],
      discard: [],
    })

    const states = mover.getNextStates(state, 3)
    expect(states.length).toBe(2)
    expectState(states, [1], [2], [3])
    expectState(states, [2], [1], [3])
  })

  it('gets all possible next states with draws', () => {
    const state = gs.create({
      deck: [1],
      hand: [2, 3],
      discard: [4, 5, 6],
      drawEffect: 2,
    })

    const states = mover.getNextStates(state, 1)
    expect(states.length).toBe(6)
    expectState(states, [4], [1, 2, 5, 6], [3])
    expectState(states, [5], [1, 2, 4, 6], [3])
    expectState(states, [6], [1, 2, 4, 5], [3])
  })

  it('gets all possible next states with discards', () => {
    const state = gs.create({
      deck: [],
      hand: [2, 3, 4, 5],
      discard: [],
      discardEffect: 2,
    })

    const states = mover.getNextStates(state, 2)
    expect(states.length).toBe(9)
    expectState(states, [2, 3], [4, 5], [])
    expectState(states, [2, 4], [3, 5], [])
    expectState(states, [2, 5], [3, 4], [])
    expectState(states, [3, 4], [2, 5], [])
    expectState(states, [4, 5], [2, 3], [])
  })

  it('gets all possible next states with cycles', () => {
    const state = gs.create({
      deck: [1],
      hand: [2, 3, 4, 5],
      discard: [],
      cycleEffect: 2,
    })

    const states = mover.getNextStates(state, 2)
    expect(states.length).toBe(6)
    expectEveryState(states, [], [1, 3, 4, 5], [2])
  })
})
