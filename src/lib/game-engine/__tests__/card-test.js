jest.unmock('../game-data')
jest.unmock('../card')

import Card from '../card'

describe('A card', () => {
  it('can be retieved via desc', () => {
    expect(Card.get('P')).toBeDefined()
    const card = Card.list[Card.get('P')]
    expect(card.physical).toBe(1)
  })

  it('can be retieved via a set', () => {
    expect(Card.getSet('Chump')).toBeDefined()
    const card = Card.list[Card.getSet('Chump')[0]]
    expect(card).toBeDefined()
  })
})
