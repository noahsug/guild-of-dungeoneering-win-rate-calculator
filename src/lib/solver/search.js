import _ from '../../utils'
import { gs, CardResolver, CardMover } from '../game-engine'
import { MAX_DEPTH } from './constants'

export default class Search {
  constructor() {
    this.mover_ = new CardMover()
    this.resolver_ = new CardResolver()
    this.bestMoves_ = {}
    this.worstMoves_ = {}
  }

  set hasher(hasher) {
    this.hasher_ = hasher
  }

  set order(order) {
    this.order_ = order
    this.mover_.order = order
  }

  set initState(initState) {
    this.resolver_.setInitialState(initState)
    const complexity = _.minZero(gs.cards(initState.player).length *
                                 gs.cards(initState.enemy).length - 50)
    this.bestMoveAccuracy = 15 - Math.min(11, Math.sqrt(complexity) * 2) | 0
    this.worstMoveAccuracy = this.bestMoveAccuracy
  }

  solve(state, depth = 0) {
    this.visited_ = {}
    this.lastCardPlayed_ = null
    return this.getResult_(state, depth)
  }

  get lastCardPlayed() {
    return this.lastCardPlayed_
  }

  getResult_(state, depth) {
    const hash = this.hasher_.hash(state, depth)
    if (this.visited_[hash]) return 0
    this.visited_[hash] = true
    const enemyCard = this.order_.enemyDraws[depth]
    const bestMove = this.bestMoves_[hash]
    if (bestMove !== undefined) {
      const moveHash = this.hasher_.hashMove(hash, bestMove)
      const result = this.getResultForMove_(
          state, bestMove, enemyCard, hash, moveHash, depth)
      this.lastCardPlayed_ = bestMove
      return result
    }

    const hand = _.uniq(state.player.hand)
    _.shuffleInPlace(hand)
    const len = hand.length
    for (let i = 0; i < len; i++) {
      const playerCard = hand[i]
      const moveHash = this.hasher_.hashMove(hash, playerCard)
      if (this.worstMoves_[moveHash] > this.worstMoveAccuracy) continue
      const result = this.getResultForMove_(
          state, playerCard, enemyCard, hash, moveHash, depth)
      if (result) {
        this.updateBestMoves_(state, playerCard, enemyCard, hash, moveHash)
        this.lastCardPlayed_ = playerCard
        return 1
      }
      this.updateWorstMoves_(state, playerCard, enemyCard, hash, moveHash)
    }
    return 0
  }

  getResultForMove_(state, playerCard, enemyCard, hash, moveHash, depth) {
    if (this.visited_[moveHash]) return 0
    this.visited_[moveHash] = true
    const result = this.searchForResult_(
        state, playerCard, enemyCard, hash, depth)
    return result
  }

  searchForResult_(state, playerCard, enemyCard, hash, depth) {
    const nextState = gs.clone(state)
    let result = this.resolver_.resolve(nextState, playerCard, enemyCard)
    if (result) {
      this.bestMoves_[hash] = playerCard
    } else if (depth < MAX_DEPTH && result === undefined) {
      const i = state.player.hand.indexOf(playerCard)
      this.mover_.moveCards(nextState, i, depth)
      // TODO: Check visited to see if nextState has a result?
      result = this.getResult_(nextState, depth + 1)
    }
    return result
  }

  updateWorstMoves_(state, playerCard, enemyCard, hash, moveHash) {
    const worstMove = this.worstMoves_[moveHash]
    if (worstMove === undefined) {
      this.worstMoves_[moveHash] = 1
    } else if (worstMove !== -1) {
      this.worstMoves_[moveHash]++
    }
  }

  updateBestMoves_(state, playerCard, enemyCard, hash, moveHash) {
    this.worstMoves_[moveHash] = -1
    if (this.bestMoves_[hash]) return
    const bestMove = this.bestMoves_[moveHash]
    if (bestMove === undefined) {
      this.bestMoves_[moveHash] = 1
    } else if (bestMove > this.bestMoveAccuracy) {
      this.bestMoves_[hash] = playerCard
    } else {
      this.bestMoves_[moveHash]++
    }
  }
}
