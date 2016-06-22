jest.unmock('../game-data')

import _ from '../../../utils'
import gameData from '../game-data'

const checkEntitySets = (entity) => {
  _.each(entity.sets || [], (set) => {
    // if (!gameData.sets[set]) console.error('missing', set)
    expect(gameData.sets[set]).toBeDefined()
  })
}

const expectValidPlayers = (players) => {
  _.each(players, (player) => {
    expect(player.health).toBeDefined()
    expect(player.sets).toBeDefined()
    expect(player.sets).not.toBeEmpty()
    checkEntitySets(player)
  })
}

describe('Game data', () => {
  it('has valid enemies', () => {
    expectValidPlayers(gameData.enemies)
  })

  it('has valid heroes', () => {
    expectValidPlayers(gameData.heroes)
  })

  it('has valid items', () => {
    _.each(gameData.items, (item) => {
      expect(item.slot).toBeDefined()
      checkEntitySets(item)
    })
  })

  it('has valid sets', () => {
    _.each(gameData.sets, (cards) => {
      _.each(cards, (card) => {
        _.each(card.split('/'), (attr) => {
          expect(gameData.CARD_ATTRS).toHaveKey(attr)
        })
      })
    })
  })
})
