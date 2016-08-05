import _ from '../../utils'
import { gs } from '../game-engine'
import { MAX_DEPTH } from './constants'

export default class CardOrder {
  set initState(state) {
    this.depth_ = 0
    this.enemyCards_ = gs.cards(state.enemy)
    this.enemyCardCycles_ = Math.ceil(MAX_DEPTH / this.enemyCards_.length)
    this.nextCycle_ = 1

    this.enemyDraws = this.createEnemyDraws_(this.enemyCards_)
    this.endTurnDrawValues = new Array(MAX_DEPTH)
    this.drawValues = new Array(MAX_DEPTH)
    this.discardValues = new Array(MAX_DEPTH)
    this.cycleDrawValues = new Array(MAX_DEPTH)
    this.cycleDiscardValues = new Array(MAX_DEPTH)
  }

  createEnemyDraws_(cards) {
    let enemyDraws = []
    _.assert(cards.length > 0)
    while (enemyDraws.length <= MAX_DEPTH) {
      enemyDraws = enemyDraws.concat(cards)
    }
    return enemyDraws
  }

  playEnemyCard(enemyCard) {
    const toSwap = this.enemyDraws.indexOf(enemyCard, this.depth_)
    this.enemyDraws[toSwap] = this.enemyDraws[this.depth_]
    this.enemyDraws[this.depth_] = enemyCard
    this.adjustDepth_(1)
  }

  unplayEnemyCard() {
    this.adjustDepth_(-1)
  }

  adjustDepth_(amount) {
    _.assert(amount === 1 || amount === -1)
    this.depth_ += amount
    if (this.depth_ % this.enemyCards_.length === 0 && amount === 1) {
      this.nextCycle_++
    }
    if ((this.depth_ + 1) % this.enemyCards_.length === 0 && amount === -1) {
      this.nextCycle_--
    }
  }

  get enemyDeck() {
    return this.enemyDraws.slice(this.depth_, this.cycleEndIndex)
  }

  get cycleEndIndex() {
    return this.nextCycle_ * this.enemyCards_.length
  }

  get cycleStartIndex() {
    return (this.nextCycle_ - 1) * this.enemyCards_.length
  }

  randomize() {
    const numEnemyCards = this.enemyCards_.length
    _.shuffleRange(this.enemyDraws, this.depth_, this.cycleEndIndex)
    for (let i = this.nextCycle_; i < this.enemyCardCycles_; i++) {
      _.shuffleRange(
          this.enemyDraws, i * numEnemyCards, (i + 1) * numEnemyCards)
    }
    _.fill(this.endTurnDrawValues, Math.random)
    _.fill(this.drawValues, Math.random)
    _.fill(this.discardValues, Math.random)
    _.fill(this.cycleDrawValues, Math.random)
    _.fill(this.cycleDiscardValues, Math.random)
  }
}
