jest.unmock('../hasher')
jest.unmock('../../game-engine/game-state')

import _ from '../../../utils'
import { gameData } from '../../game-engine'
import gs from '../../game-engine/game-state'
import Hasher from '../hasher'

let hasher
let order
let enemyDraws

function createState(hero = {}, enemy = {}) {
  hero = _.defaults(hero, {
    deck: [1, 2, 3],
    hand: [2, 3],
    discard: [3, 4, 4],
    health: 5,
  })
  enemy = _.defaults(enemy, {
    deck: [50, 52, 54],
    hand: [9, 2],
    discard: [52, 9, 2],
    health: 3,
  })
  return gs.create(hero, enemy)
}

describe('hasher', () => {
  beforeAll(() => {
    _.mock(gameData, 'cards', _.range(100))
  })

  beforeEach(() => {
    enemyDraws = _.range(5).concat(_.range(5))
    hasher = new Hasher()
    order = { enemyDraws, cycleStartIndex: 0 }
    hasher.order = order
  })

  afterAll(() => {
    _.unmock(gameData, 'cards')
  })

  it('caches game state', () => {
    const hash = hasher.hash(createState())
    expect(hash).toBeDefined()
  })

  it('caches game state at depth', () => {
    const hash = hasher.hash(createState(), 0)
    expect(hash).toBeDefined()
  })

  it('detects changes in depth', () => {
    const hash = hasher.hash(createState(), 0)
    const hash2 = hasher.hash(createState(), 1)
    const hash3 = hasher.hash(createState(), 1)
    expect(hash).not.toBe(hash2)
    expect(hash2).toBe(hash3)
  })

  it('detects changes in health', () => {
    const hash = hasher.hash(createState({ health: 5 }))
    const hash2 = hasher.hash(createState({ health: 6 }))
    expect(hash).not.toBe(hash2)
  })

  it('detects changes in cards', () => {
    const hash = hasher.hash(createState({ hand: [1, 1, 2] }))
    const hash2 = hasher.hash(createState({ hand: [1, 2] }))
    expect(hash).not.toBe(hash2)
  })

  it('looks at enemy card order', () => {
    _.setInPlace(enemyDraws, [1, 1, 2, 2, 1])
    const hash = hasher.hash(createState(), 4)
    _.setInPlace(enemyDraws, [2, 2, 1, 1, 1])
    const hash2 = hasher.hash(createState(), 4)
    _.setInPlace(enemyDraws, [1, 1, 2, 1, 2])
    const hash3 = hasher.hash(createState(), 4)
    expect(hash).toBe(hash2)
    expect(hash).not.toBe(hash3)
  })

  it('hashes a move', () => {
    const hash = hasher.hash(createState())
    const moveHash = hasher.hashMove(hash, 1)
    const moveHash2 = hasher.hashMove(hash, 1)
    const moveHash3 = hasher.hashMove(hash, 2)
    expect(moveHash).toBe(moveHash2)
    expect(moveHash).not.toBe(moveHash3)
  })

  it('detects infinite loops', () => {
    const hash1 = hasher.hash(createState(), 1)
    order.cycleStartIndex = 5
    const hash2 = hasher.hash(createState(), 6)
    expect(hash1).toBe(hash2)
  })
})
