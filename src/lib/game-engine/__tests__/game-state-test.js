jest.unmock('../game-state')

import gs from '../game-state'

describe('game state', () => {
  it('draws at given index', () => {
    const state = gs.create({
      deck: [1, 2, 3],
      hand: [4, 5],
    })
    gs.drawIndex(state.hero, 0)
    expect(state.hero.deck).toSortedEqual([2, 3])
    expect(state.hero.hand).toSortedEqual([1, 4, 5])
  })

  it('discards at given index', () => {
    const state = gs.create({
      hand: [4, 5],
      discard: [],
    })
    gs.discardIndex(state.hero, 0)
    expect(state.hero.hand).toEqual([5])
    expect(state.hero.discard).toEqual([4])
  })

  it('draws discard if deck is empty', () => {
    const state = gs.create({
      deck: [1],
      hand: [],
      discard: [2, 3],
    })
    gs.prepDraw(state.hero)
    expect(state.hero.deck).toEqual([1])
    expect(state.hero.hand).toEqual([])
    expect(state.hero.discard).toSortedEqual([2, 3])

    gs.drawIndex(state.hero, 0)
    gs.prepDraw(state.hero)
    expect(state.hero.deck).toSortedEqual([2, 3])
    expect(state.hero.hand).toEqual([1])
    expect(state.hero.discard).toEqual([])
  })

  it('draws one at given index value', () => {
    const hero = {
      deck: [1, 2, 3],
      hand: [],
      discard: [],
    }
    gs.drawOne(hero, 0)
    expect(hero.deck.sort()).toEqual([2, 3])
    expect(hero.hand).toEqual([1])

    gs.drawOne(hero, 0.9)
    expect(hero.deck).toEqual([2])
    expect(hero.hand.sort()).toEqual([1, 3])

    gs.drawOne(hero, 0)
    expect(hero.deck).toEqual([])
    expect(hero.hand.sort()).toEqual([1, 2, 3])
  })

  it('draws one from discard when deck is empty', () => {
    const hero = {
      deck: [],
      hand: [],
      discard: [1],
    }

    gs.drawOne(hero, 0)
    expect(hero.deck).toEqual([])
    expect(hero.hand).toEqual([1])
    expect(hero.discard).toEqual([])
  })

  it('draws multiple cards at given index value', () => {
    const hero = {
      deck: [1, 2, 3, 4, 5],
      hand: [],
      discard: [],
    }
    gs.draw(hero, 0.5, 2)
    expect(hero.deck.sort()).toEqual([1, 2, 5])
    expect(hero.hand.sort()).toEqual([3, 4])

    gs.draw(hero, 0.9, 2)
    expect(hero.deck).toEqual([2])
    expect(hero.hand.sort()).toEqual([1, 3, 4, 5])
  })

  it('draws multiple cards from discard when deck is empty', () => {
    const hero = {
      deck: [],
      hand: [],
      discard: [1, 2],
    }

    gs.draw(hero, 0, 2)
    expect(hero.deck).toEqual([])
    expect(hero.hand.sort()).toEqual([1, 2])
    expect(hero.discard).toEqual([])
  })

  it('does not draw with full hand', () => {
    const hero = {
      deck: [],
      hand: [1, 2, 3],
      discard: [],
    }

    gs.draw(hero, 0, 2)
    expect(hero.deck).toEqual([])
    expect(hero.hand.sort()).toEqual([1, 2, 3])
    expect(hero.discard).toEqual([])
  })

  it('discards multiple cards at given index value', () => {
    const hero = {
      deck: [],
      hand: [1, 2, 3, 4, 5],
      discard: [],
    }
    gs.discard(hero, 0.5, 2)
    expect(hero.hand.sort()).toEqual([1, 2, 5])
    expect(hero.discard.sort()).toEqual([3, 4])

    gs.discard(hero, 0.9, 2)
    expect(hero.hand).toEqual([2])
    expect(hero.discard.sort()).toEqual([1, 3, 4, 5])
  })
})
