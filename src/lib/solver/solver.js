import _ from '../../utils'
import { gs, gsFactory, CardResolver, CardMover } from '../game-engine'
import Search from './search'
import Results from './results'
import CardOrder from './card-order'
import stateIterator from './state-iterator'
import Hasher from './hasher'

export default class Solver {
  init(hero, enemy) {
    this.state = gsFactory.create(hero, enemy)
    this.state.depth = -1

    this.order_ = new CardOrder()
    this.order_.initState = this.state

    this.hasher_ = new Hasher()
    this.hasher_.order = this.order_

    this.mover_ = new CardMover()

    this.resolver_ = new CardResolver()
    this.resolver_.initState = this.state

    this.search_ = new Search()
    this.search_.initState = this.state

    this.results_ = new Results()
    this.results_.bestMovePruning = this.search_.bestMovePruning

    _.perf.start('starting states')
    const ungroupedChildren = this.mover_.getStartingStates(this.state)
    this.setState_(this.state, ungroupedChildren)
    _.perf.end('starting states')
  }

  next() {
    const state = stateIterator.getNextState(this.state)
    this.order_.randomize()
    const bestMove = this.search_.solve(state, this.order_)
    this.results_.recordResult(state, this.enemyCardPlayed, bestMove)
  }

  get enemyCardPlayed() {
    return this.order_.enemyDraws[this.state.depth + 1]
  }

  // Optionally specify selected state, enemy card played or hero card played.
  getResult(state, enemyCard, heroCard) {
    return this.results_.getResult(state, enemyCard, heroCard)
  }

  get solved() {
    return !!this.state.solved
  }

  get enemyDeck() {
    return this.order_.enemyDeck
  }

  play(state, enemyCard, heroCard) {
    this.search_.clearCache()
    const resolvedState = gs.clone(state)
    const result = this.resolver_.resolve(resolvedState, heroCard, enemyCard)
    if (result !== undefined) state.solved = true
    const children = this.mover_.getNextStates(resolvedState, heroCard)
    this.setState_(state, children)
    this.order_.playEnemyCard(enemyCard)
  }

  unplay() {
    this.setState_(_.assert(this.state.parent))
    this.order_.unplayEnemyCard()
  }

  setState_(state, ungroupedChildren) {
    this.state = state
    if (ungroupedChildren) {
      this.setChildrenIds_(ungroupedChildren)
      stateIterator.initState(state, ungroupedChildren)
    }
    this.results_.states = this.state.children
  }

  setChildrenIds_(children) {
    children.forEach(c => {
      c.id = this.hasher_.hash(c, this.state.depth + 1)
    })
  }
}
