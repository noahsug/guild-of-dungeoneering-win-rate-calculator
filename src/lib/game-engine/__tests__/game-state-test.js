jest.unmock('../game-state')

import gs from '../game-state'

describe('game state', () => {
  it('draws at given index', () => {
    const state = gs.create({
      deck: [1, 2, 3],
      hand: [4, 5],
    })
    gs.drawIndex(state.player, 0)
    expect(state.player.deck).toSortedEqual([2, 3])
    expect(state.player.hand).toSortedEqual([1, 4, 5])
  })

  it('discards at given index', () => {
    const state = gs.create({
      hand: [4, 5],
      discard: [],
    })
    gs.discardIndex(state.player, 0)
    expect(state.player.hand).toEqual([5])
    expect(state.player.discard).toEqual([4])
  })

  it('draws discard if deck is empty', () => {
    const state = gs.create({
      deck: [1],
      hand: [],
      discard: [2, 3],
    })
    gs.prepDraw(state.player)
    expect(state.player.deck).toEqual([1])
    expect(state.player.hand).toEqual([])
    expect(state.player.discard).toSortedEqual([2, 3])

    gs.drawIndex(state.player, 0)
    gs.prepDraw(state.player)
    expect(state.player.deck).toSortedEqual([2, 3])
    expect(state.player.hand).toEqual([1])
    expect(state.player.discard).toEqual([])
  })

  it('draws one at given index value', () => {
    const player = {
      deck: [1, 2, 3],
      hand: [],
      discard: [],
    }
    gs.drawOne(player, 0)
    expect(player.deck.sort()).toEqual([2, 3])
    expect(player.hand).toEqual([1])

    gs.drawOne(player, 0.9)
    expect(player.deck).toEqual([2])
    expect(player.hand.sort()).toEqual([1, 3])

    gs.drawOne(player, 0)
    expect(player.deck).toEqual([])
    expect(player.hand.sort()).toEqual([1, 2, 3])
  })

  it('draws one from discard when deck is empty', () => {
    const player = {
      deck: [],
      hand: [],
      discard: [1],
    }

    gs.drawOne(player, 0)
    expect(player.deck).toEqual([])
    expect(player.hand).toEqual([1])
    expect(player.discard).toEqual([])
  })

  it('draws multiple cards at given index value', () => {
    const player = {
      deck: [1, 2, 3, 4, 5],
      hand: [],
      discard: [],
    }
    gs.draw(player, 0.5, 2)
    expect(player.deck.sort()).toEqual([1, 2, 5])
    expect(player.hand.sort()).toEqual([3, 4])

    gs.draw(player, 0.9, 2)
    expect(player.deck).toEqual([2])
    expect(player.hand.sort()).toEqual([1, 3, 4, 5])
  })

  it('draws multiple cards from discard when deck is empty', () => {
    const player = {
      deck: [],
      hand: [],
      discard: [1, 2],
    }

    gs.draw(player, 0, 2)
    expect(player.deck).toEqual([])
    expect(player.hand.sort()).toEqual([1, 2])
    expect(player.discard).toEqual([])
  })

  it('does not draw with full hand', () => {
    const player = {
      deck: [],
      hand: [1, 2, 3],
      discard: [],
    }

    gs.draw(player, 0, 2)
    expect(player.deck).toEqual([])
    expect(player.hand.sort()).toEqual([1, 2, 3])
    expect(player.discard).toEqual([])
  })

  it('discards multiple cards at given index value', () => {
    const player = {
      deck: [],
      hand: [1, 2, 3, 4, 5],
      discard: [],
    }
    gs.discard(player, 0.5, 2)
    expect(player.hand.sort()).toEqual([1, 2, 5])
    expect(player.discard.sort()).toEqual([3, 4])

    gs.discard(player, 0.9, 2)
    expect(player.hand).toEqual([2])
    expect(player.discard.sort()).toEqual([1, 3, 4, 5])
  })
})
