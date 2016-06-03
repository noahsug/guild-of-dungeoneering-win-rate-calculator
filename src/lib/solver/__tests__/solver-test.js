jest.autoMockOff()

import _ from '../../../utils'

const { gameData } = require('../../game-engine')
const Card = require('../../game-engine/card')
const Solver = require('../solver')

let solver

function getCards(descList) {
  return descList.map((d) => Card.get(d)).sort()
}

describe('solver', () => {
  beforeEach(() => {
    solver = new Solver()
  })

  it('creates starting states', () => {
    solver.init({ name: 'Chump' }, { name: 'Fire Imp' })
    expect(solver.states.length).toBe(20)

    const cards = gameData.sets.Chump
    const hand = getCards([cards[2], cards[3], cards[4]])
    const deck = getCards([cards[0], cards[1], cards[5]])
    let match = false
    solver.states.forEach((state) => {
      if (_.isEqual(state.player.deck.sort(), deck) &&
          _.isEqual(state.player.hand.sort(), hand) &&
          _.isEqual(state.player.discard, [])) {
        match = true
      }
    })
    expect(match).toBe(true)
  })

  it('can solve a starting hand', () => {
    solver.init({ name: 'Chump' }, { name: 'Fire Imp' })
    expect(solver.result).toBeFalsy()
    solver.next()
    expect(solver.result).toBe(1)
  })

  it('solves chump vs gray ooze', () => {
    solver.init({ name: 'Chump', traits: ['Crones Discipline'] },
                { name: 'Gray Ooze' })
    for (let i = 0; i < 2000; i++) {
      solver.next()
    }
    expect(solver.result).toBeCloseTo(0.41, 0.05)
  })

  it('solves Apprentice vs Ghost', () => {
    solver.init({ name: 'Apprentice', items: ['Shimmering Cloak'] },
                { name: 'Ghost' })
    for (let i = 0; i < 20000; i++) {
      solver.next()
    }
    expect(solver.result).toBeCloseTo(0.74, 0.05)
  })

  it('solves complex problems', () => {
    solver.init({
      name: 'Chump',
      items: ['Scroll Of Souls', 'Fez', 'Ocean Staff', 'Bark Vest'],
      traits: [],
    }, { name: 'Angry Bunny' })
    solver.next()
    expect(solver.result).toBeBetween(0, 1)
  })
})
