import _ from '../../utils'
import { gs } from '../game-engine'
import { MAX_DEPTH } from './constants'

export default class CardOrder {
  set initState(state) {
    this.depth_ = 0
    this.enemyCards_ = gs.cards(state.enemy)
    this.enemyCardCycles_ = Math.ceil(MAX_DEPTH / this.enemyCards_.length)
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
    while (enemyDraws.length < MAX_DEPTH) {
      enemyDraws = enemyDraws.concat(cards)
    }
    return enemyDraws
  }

  playEnemyCard(enemyCard) {
    const toSwap = this.enemyDraws.indexOf(enemyCard)
    this.enemyDraws[toSwap] = this.enemyDraws[this.depth_]
    this.enemyDraws[this.depth_] = enemyCard
    this.depth_++
  }

  unplayEnemyCard() {
    this.depth_--
  }

  get enemyDeck() {
    return this.enemyDraws.slice(this.depth_, this.enemyCards_.length)
  }

  randomize() {
    const len = this.enemyCards_.length
    _.shuffleRange(this.enemyDraws, this.depth_, len)
    for (let i = 1; i < this.enemyCardCycles_; i++) {
      _.shuffleRange(this.enemyDraws, i * len, (i + 1) * len)
    }
    _.fill(this.endTurnDrawValues, Math.random)
    _.fill(this.drawValues, Math.random)
    _.fill(this.discardValues, Math.random)
    _.fill(this.cycleDrawValues, Math.random)
    _.fill(this.cycleDiscardValues, Math.random)
  }
}
