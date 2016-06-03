import _ from '../../utils'
import { gs, gsFactory, CardResolver, CardMover } from '../game-engine'
import Search from './search'
import Hasher from './hasher'
import Results from './results'
import CardOrder from './card-order'

export default class Solver {
  init(player, enemy) {
    const initState = gsFactory.create(player, enemy)
    this.prevStates_ = []
    this.depth_ = 0
    this.count = 0

    this.mover_ = new CardMover()

    this.order_ = new CardOrder()
    this.order_.initState = initState

    this.hasher_ = new Hasher()
    this.hasher_.order = this.order_

    this.resolver_ = new CardResolver()
    this.resolver_.setInitialState(initState)

    this.search_ = new Search()
    this.search_.order = this.order_
    this.search_.hasher = this.hasher_
    this.search_.initState = initState

    this.results_ = new Results()
    this.results_.bestMoveAccuracy = this.search_.bestMoveAccuracy
    this.results_.setState(initState)

    this.states = this.mover_.getStartingStates(initState)
  }

  next() {
    const index = this.count % this.states.length
    this.count++
    if (index === 0) _.shuffleInPlace(this.states)
    this.order_.randomize()
    const state = this.states[index]
    const result = this.search_.solve(state, this.depth_)

    const enemyCard = this.order_.enemyDraws[this.depth_]
    const playerCard = this.search_.lastCardPlayed
    this.results_.recordResult(state, playerCard, enemyCard, result)
  }

  get result() {
    return this.results_.value
  }

  play(state, playerCard, enemyCard) {
    const resolvedState = gs.clone(state)
    const result = this.resolver_.resolve(resolvedState, playerCard, enemyCard)
    if (result !== undefined) return
    this.order_.enemyPlayed(enemyCard)
    this.results_.setState(state)
    this.prevStates_.push(this.states)
    this.depth_++
    const playerCardIndex = state.player.hand.indexOf(playerCard)
    this.states = this.mover_.getNextStates(resolvedState, playerCardIndex)
  }
}
