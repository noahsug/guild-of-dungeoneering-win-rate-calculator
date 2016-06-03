jest.unmock('../../game-engine')
jest.unmock('../../game-engine/game-state')
jest.unmock('../card-order')

import _ from '../../../utils'
import CardOrder from '../card-order'

const enemyCards = _.range(20)
let order

describe('card order', () => {
  beforeEach(() => {
    order = new CardOrder()
    order.initState = {
      enemy: { deck: enemyCards.slice(), hand: [], discard: [] },
    }
    order.randomize()
  })

  it('provides enemy draws', () => {
    expect(_.uniq(order.enemyDraws)).toSortedEqual(enemyCards)
  })

  it('randomizes enemy draws', () => {
    function enemyDrawsAreDifferent() {
      const enemyDraws = order.enemyDraws.slice()
      order.randomize()
      return !_.isEqual(enemyDraws, order.enemyDraws)
    }
    expect(enemyDrawsAreDifferent).toEventuallyBe(true)
  })

  it('maintains a card cycle', () => {
    const len = enemyCards.length
    let cards = order.enemyDraws.slice(0, len)
    expect(cards).toSortedEqual(enemyCards)
    cards = order.enemyDraws.slice(len, 2 * len)
    expect(cards).toSortedEqual(enemyCards)
  })

  it('creates draw values', () => {
    function drawsAreDifferent() {
      const draws = order.drawValues.slice()
      order.randomize()
      return !_.isEqual(draws, order.drawValues)
    }
    expect(drawsAreDifferent).toEventuallyBe(true)
  })

  it('can mark enemy cards as played', () => {
    order.enemyPlayed(5)
    order.randomize()
    expect(order.enemyDraws[0]).toBe(5)

    order.enemyPlayed(2)
    order.randomize()
    expect(order.enemyDraws[0]).toBe(5)
    expect(order.enemyDraws[1]).toBe(2)
  })
})
