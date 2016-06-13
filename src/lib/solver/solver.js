import _ from '../../utils'
import { gs, gsFactory, CardResolver, CardMover } from '../game-engine'
import Search from './search'
import Results from './results'
import CardOrder from './card-order'

export default class Solver {
  init(player, enemy) {
    this.state = gsFactory.create(player, enemy)
    this.state.depth = 0
    this.state.iterations = 0

    this.order_ = new CardOrder()
    this.order_.initState = this.state

    this.mover_ = new CardMover()

    this.resolver_ = new CardResolver()
    this.resolver_.initState = this.state

    this.search_ = new Search()
    this.search_.initState = this.state

    this.state.children = this.mover_.getStartingStates(this.state)
    this.state.children.forEach(c => { c.depth = 1 })

    this.results_ = new Results()
    this.results_.bestMovePruning = this.search_.bestMovePruning
    this.results_.states = this.state.children
  }

  next() {
    const state = this.getNextChild_()
    this.order_.randomize()
    const bestMove = this.search_.solve(state, this.order_)
    const enemyCard = this.order_.enemyDraws[state.depth]
    this.results_.recordResult(state, enemyCard, bestMove)
  }

  getNextChild_() {
    const children = this.state.children
    const index = this.state.iterations % children.length
    this.state.iterations++
    if (index === 0) _.shuffleInPlace(children)
    return children[index]
  }

  // Optionally specify selected state, enemy card played or player card played.
  getResult(state, enemyCard, playerCard) {
    return this.results_.getResult(state, enemyCard, playerCard)
  }

  play(state, playerCard, enemyCard) {
    const resolvedState = gs.clone(state)
    const result = this.resolver_.resolve(resolvedState, playerCard, enemyCard)
    if (result) return
    this.order_.enemyPlayed(enemyCard)
    state.children = this.mover_.getNextStates(resolvedState, playerCard)
    state.children.forEach(c => { c.depth = state.depth })
    this.results_.states = state.children
    this.state = state
  }
}
