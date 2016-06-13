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
    expect(solver.state.children.length).toBe(20)

    const cards = gameData.sets.Chump
    const hand = getCards([cards[2], cards[3], cards[4]])
    const deck = getCards([cards[0], cards[1], cards[5]])
    let match = false
    solver.state.children.forEach((state) => {
      if (_.isSortedEqual(state.player.deck, deck) &&
          _.isSortedEqual(state.player.hand, hand) &&
          _.isEqual(state.player.discard, [])) {
        match = true
      }
    })
    expect(match).toBe(true)
  })

  it('can solve a starting hand', () => {
    solver.init({ name: 'Chump' }, { name: 'Fire Imp' })
    expect(solver.getResult()).toBeFalsy()
    solver.next()
    expect(solver.getResult()).toBe(1)
  })

  // Slow
  xit('solves chump vs gray ooze', () => {
    solver.init({ name: 'Chump', traits: ['Crones Discipline'] },
                { name: 'Gray Ooze' })
    for (let i = 0; i < 4000; i++) {
      solver.next()
    }
    expect(solver.getResult()).toBeAround(0.41, 0.05)
  })

  // Slow
  xit('solves Apprentice vs Ghost', () => {
    solver.init({ name: 'Apprentice', items: ['Shimmering Cloak'] },
                { name: 'Ghost' })
    for (let i = 0; i < 20000; i++) {
      solver.next()
    }
    expect(solver.getResult()).toBeAround(0.74, 0.05)
  })

  it('solves complex problems', () => {
    solver.init({
      name: 'Chump',
      items: ['Scroll Of Souls', 'Fez', 'Ocean Staff', 'Bark Vest'],
      traits: [],
    }, { name: 'Angry Bunny' })
    solver.next()
    expect(solver.getResult()).toBeBetween(0, 1)
  })
})
