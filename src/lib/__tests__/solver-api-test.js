jest.autoMockOff()

import _ from '../../utils'
const { gameData } = require('../game-engine')
const SolverApi = require('../solver-api')

let solver

function findSelection(selection) {
  return solver.selections.find(s => (
    _.isSortedEqual(selection, s.cards)
  ))
}

function findState(heroHand) {
  const states = solver.solver_.state.children.filter((s) => {
    const cards = s.hero.hand.map(c => gameData.cards[c].desc)
    return _.isSortedEqual(cards, heroHand)
  })
  expect(states.length).toBe(1)
  return states[0]
}

function recordResult(handDesc, enemyCardDesc, heroCardDesc) {
  const state = findState(handDesc)
  const enemyCard = gameData.cardDescs[enemyCardDesc]
  const heroCard = gameData.cardDescs[heroCardDesc]
  solver.solver_.results_.recordResult(state, enemyCard, heroCard || 0)
}

describe('solver api', () => {
  beforeEach(() => {
    solver = new SolverApi()
    solver.init({
      hero: {
        name: 'Chump',
        traits: ['Crones Discipline'],
      },
      enemy: {
        name: 'Gray Ooze',
      },
    })
  })

  it('provides state selections', () => {
    expect(solver.selections.length).toBe(5)
    expect(findSelection(['B', 'B', 'P', 'P'])).toBeDefined()
  })

  it('provides enemy card selections', () => {
    solver.play(['B', 'B', 'P', 'P'])
    expect(solver.selections.length).toBe(4)
    expect(findSelection(['M/U'])).toBeDefined()
  })

  it('provides hero card selections', () => {
    solver.play(['B', 'B', 'P', 'P'])
    solver.play(['M/U'])
    expect(solver.selections.length).toBe(2)
    expect(findSelection(['P'])).toBeDefined()
  })

  it('provides state selections after selecting a hero card', () => {
    solver.play(['B', 'B', 'P', 'P'])
    solver.play(['M/U'])
    solver.play(['P'])
    expect(solver.selections.length).toBe(2)
    expect(findSelection(['B', 'B', 'P', 'P/P'])).toBeDefined()
  })

  it('can unplay cards', () => {
    solver.play(['B', 'B', 'P', 'P'])
    solver.play(['M/U'])
    solver.play(['P'])

    solver.back()  // unplay P
    expect(solver.selections.length).toBe(2)
    expect(findSelection(['P'])).toBeDefined()

    solver.back()  // unplay M/U
    expect(solver.selections.length).toBe(4)
    expect(findSelection(['M/U'])).toBeDefined()
  })

  it('provides an overall winrate', () => {
    const hand = ['B', 'B', 'P', 'P']
    recordResult(hand, 'M', 'P')
    recordResult(hand, 'M', 0)
    recordResult(hand, 'M', 'P')

    expect(solver.result).toBe(2 / 3)
  })

  it('updates win rate as user makes selections', () => {
    const hand = ['B', 'B', 'P', 'P']
    recordResult(hand, 'M', 'B')
    recordResult(hand, 'M', 'P')
    recordResult(hand, 'M', 0)
    recordResult(hand, 'M/U', 'P')
    recordResult(hand, 'M/U', 'P')
    recordResult(hand, 'M/HPD', 0)
    recordResult(['B', 'B', 'P', 'P/P'], 'M/HPD', 'P/P')

    expect(solver.result).toBe(((2 / 3 + 1 + 0) / 3 + 1) / 2)
    solver.play(hand)
    expect(solver.result).toBe((2 / 3 + 1 + 0) / 3)
    solver.play('M')
    expect(solver.result).toBe(2/ 3)
    solver.play('P')
    expect(solver.result).toBeNaN()
    solver.back()
    expect(solver.result).toBe(2/ 3)
  })
})
