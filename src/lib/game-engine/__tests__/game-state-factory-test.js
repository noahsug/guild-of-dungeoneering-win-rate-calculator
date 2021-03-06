jest.unmock('../game-state')
jest.unmock('../game-state-factory')
jest.unmock('../card')
jest.unmock('../game-data')

import gsf from '../game-state-factory'
import Card from '../card'

function getSetCards(...sets) {
  let cards = []
  sets.forEach(set => {
    cards = cards.concat(Card.getSet(set))
  })
  return cards
}

describe('solver factory', () => {
  it('creates a state with the given hero and enemy', () => {
    const state = gsf.create({
      name: 'Apprentice',
      traits: ['Warriors Might', 'Level 4', 'Punch Drunk Final Stage'],
      items: ['Sparkly Headband', 'Wooden Shield', 'Owl Familiar'],
    }, {
      name: 'Crab King',
      traits: ['Leader x3'],
    })

    expect(state.enemy.deck).toSortedEqual(getSetCards(
        'Spooky 4', 'Armed 5', 'Nature 1'))
    expect(state.enemy.tough).toBe(1)
    expect(state.enemy.spikey).toBe(1)
    expect(state.enemy.health).toBe(15)

    expect(state.hero.deck).toSortedEqual(getSetCards(
        'Fire 2', 'Stupidity 1', 'Apprentice', 'Holy 3', 'Armour 1'))
    expect(state.hero.physicalNextEffect).toBe(1)
    expect(state.hero.punchDrunk).toBe(1)
    expect(state.hero.handSize).toBe(4)
    expect(state.hero.tenacious).toBe(1)
    expect(state.hero.health).toBe(8)
  })
})
