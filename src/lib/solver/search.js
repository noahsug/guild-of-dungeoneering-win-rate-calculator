import _ from '../../utils'
import { gs, CardResolver, CardMover } from '../game-engine'
import { MAX_DEPTH } from './constants'
import Hasher from './hasher'
// FIXME
import { gameData } from '../game-engine'

export default class Search {
  constructor() {
    this.mover_ = new CardMover()
    this.resolver_ = new CardResolver()
    this.bestMoves_ = new Map()
    this.worstMoves_ = new Map()

    this.hasher_ = new Hasher()
  }

  set initState(initState) {
    this.resolver_.initState = initState
    const complexity = Math.pow(gs.cards(initState.hero).length, 2) *
        initState.enemy.health
    const complexityRatio = _.bound((complexity - 200) / 900, 0, 1)

    // If a hero move wins this many times, it's selected as the best and
    // other possible hero moves are pruned.
    this.bestMovePruning = 15 - 11 * complexityRatio;

    // If a hero move loses this many times without ever winning, it's pruned.
    this.worstMovePruning = Math.sqrt(this.bestMovePruning) * 2
  }

  clearCache() {
    this.bestMoves_ = new Map()
    this.worstMoves_ = new Map()
  }

  solve(state, order) {
    window.h = {}
    this.visited_ = new Set()
    this.order_ = order
    this.hasher_.order = order
    this.mover_.order = order
    return this.getWinningMove_(state, state.depth)
  }

  getWinningMove_(state, depth) {
    if (!_.perf.maxDepth || _.perf.maxDepth < depth) {
      _.perf.maxDepth = depth
    }
    const hash = this.hasher_.hash(state, depth)
    if (this.visited_.has(hash)) return 0
    this.visited_.add(hash)
    const enemyCard = this.order_.enemyDraws[depth]
    const bestMove = this.bestMoves_.get(hash)
    if (bestMove !== undefined) {
      const moveHash = this.hasher_.hashMove(hash, bestMove)
      const result = this.getResultForMove_(
          state, bestMove, enemyCard, hash, moveHash, depth)
      return result > 0 && bestMove
    }

    const hand = _.uniq(state.hero.hand)
    _.shuffleInPlace(hand)
    const len = hand.length
    for (let i = 0; i < len; i++) {
      const heroCard = hand[i]
      const moveHash = this.hasher_.hashMove(hash, heroCard)
      if (this.worstMoves_.get(moveHash) >= this.worstMovePruning) continue
      const result = this.getResultForMove_(
          state, heroCard, enemyCard, hash, moveHash, depth)
      if (result > 0) {
        console.log(state.hero.health, 'vs', state.enemy.health, '|',
                    state.hero.deck.length, state.hero.hand.length,
                    state.hero.discard.length);
        // Update best move if we haven't already.
        if (result !== Infinity) {
          this.updateBestMoves_(state, heroCard, enemyCard, hash, moveHash)
        }
        return heroCard
      }
      // Update worst move if we haven't already.
      if (result !== -Infinity) {
        this.updateWorstMoves_(state, heroCard, enemyCard, hash, moveHash)
      }
    }
    return 0
  }

  getResultForMove_(state, heroCard, enemyCard, hash, moveHash, depth) {
    if (this.visited_.has(moveHash)) return 0
    this.visited_.add(moveHash)
    return this.searchForResult_(
        state, heroCard, enemyCard, hash, moveHash, depth)
  }

  searchForResult_(state, heroCard, enemyCard, hash, moveHash, depth) {
    const nextState = gs.clone(state)
    let result = this.resolver_.resolve(nextState, heroCard, enemyCard)
    if (result) {
      this.bestMoves_.set(hash, heroCard)
      return Infinity
    } else if (result === 0) {
      this.worstMoves_.set(moveHash, this.worstMovePruning)
      return -Infinity
    } else if (depth < MAX_DEPTH) {
      const i = state.hero.hand.indexOf(heroCard)
      this.mover_.moveCards(nextState, i, depth)
      // TODO: Check visited to see if nextState has a result?
      result = this.getWinningMove_(nextState, depth + 1)
    }
    // FIXME
    if (depth == MAX_DEPTH) return 1
    return result
  }

  updateWorstMoves_(state, heroCard, enemyCard, hash, moveHash) {
    const worstMove = this.worstMoves_.get(moveHash)
    if (worstMove === undefined) {
      this.worstMoves_.set(moveHash, 1)
    } else if (worstMove !== -1) {
      this.worstMoves_.set(moveHash, worstMove + 1)
    }
  }

  updateBestMoves_(state, heroCard, enemyCard, hash, moveHash) {
    this.worstMoves_.set(moveHash, -1)
    if (this.bestMoves_.has(hash)) return
    const bestMove = this.bestMoves_.get(moveHash)
    if (bestMove === undefined) {
      this.bestMoves_.set(moveHash, 1)
    } else if (bestMove >= this.bestMovePruning) {
      this.bestMoves_.set(hash, heroCard)
    } else {
      this.bestMoves_.set(moveHash, bestMove + 1)
    }
  }
}
