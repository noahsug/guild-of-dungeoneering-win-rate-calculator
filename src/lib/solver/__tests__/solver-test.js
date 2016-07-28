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
    expect(solver.state.children.length).toBe(6)

    const cards = gameData.sets.Chump
    const hand = getCards([cards[2], cards[3], cards[4]])
    const deck = getCards([cards[0], cards[1], cards[5]])
    let match = false
    solver.state.children.forEach((state) => {
      if (_.isSortedEqual(state.hero.deck, deck) &&
          _.isSortedEqual(state.hero.hand, hand) &&
          _.isEqual(state.hero.discard, [])) {
        match = true
      }
    })
    expect(match).toBe(true)
  })

  it('solves chump vs fire imp', () => {
    solver.init({ name: 'Chump' }, { name: 'Fire Imp' })
    for (let i = 0; i < 1000; i++) {
      solver.next()
    }
    expect(solver.getResult()).toBeAround(1, 0.05)
  })

  it('solves chump vs gray ooze', () => {
    solver.init({ name: 'Chump', traits: ['Crones Discipline'] },
                { name: 'Gray Ooze' })
    for (let i = 0; i < 4000; i++) {
      solver.next()
    }
    expect(solver.getResult()).toBeAround(0.41, 0.05)
  })

  it('handles items', () => {
    solver.init({ name: 'Bruiser', items: ['Straightjacket'] },
                { name: 'Gnoll' })
    solver.next()
    expect(solver.state.hero.health).toBe(6)
  })

  // Slow
  xit('solves Apprentice vs Ghost', () => {
    solver.init({ name: 'Apprentice', items: ['Shimmering Cloak'] },
                { name: 'Ghost' })
    for (let i = 0; i < 20000; i++) {
      solver.next()
      if (i % 500 == 0) console.log(solver.getResult())
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

  it('can play and unplay a move', () => {
    solver.init({ name: 'Chump', traits: ['Crones Discipline'] },
                { name: 'Gray Ooze' })
    const rootState = solver.state
    const nextState = solver.state.children.find(s => (
      _.isSortedEqual(s.hero.hand, getCards(['P', 'P', 'P', 'B']))
    ))
    solver.play(nextState, Card.get('M'), Card.get('P'))
    expect(solver.state).toBe(nextState)
    expect(solver.state.children.length).toBe(2)

    solver.unplay()
    expect(solver.state).toBe(rootState)
  })
})
