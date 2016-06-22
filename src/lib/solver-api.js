import _ from '../utils'
import { Solver } from './solver'
import { gameData } from './game-engine'
import SelectionList from './selection-list'

export default class SolverApi {
  constructor() {
    this.solver_ = new Solver()
    this.selectionList_ = new SelectionList(this.solver_)
  }

  init(input) {
    this.solver_.init(input.hero, input.enemy)
  }

  * start() {
    this.running_ = true
    this.iterateResult_(10)
    yield this.result
    while (this.running_) {
      this.iterateResult_(100)
      yield this.result
    }
  }

  iterateResult_(iterations) {
    for (let i = 0; i < iterations; i++) this.solver_.next()
  }

  stop() {
    this.running_ = false
  }

  play(selection) {
    this.selectionList_.play(selection)
    if (this.selectionType === 'HERO_HAND') {
      this.solver_.play(...this.selectionList_.selected.slice(-3))
    }
  }

  back() {
    if (this.selectionType === 'HERO_HAND') {
      this.solver_.unplay()
    }
    this.selectionList_.back()
  }

  get heroHealth() {
    return this.solver_.state.children[0].hero.health
  }

  get enemyHealth() {
    return this.solver_.state.children[0].enemy.health
  }

  // Returns last selected card or 'hero hand'. If there is no previous
  // seleciton, returns ''.
  get lastSelected() {
    const selected = this.selectionList_.selected
    if (!selected.length) return ''
    const card = gameData.cards[_.last(selected)]
    return card ? card.desc : 'hero hand'
  }

  get selectionType() { return this.selectionList_.type }

  get result() { return this.selectionList_.result }

  get selections() { return this.selectionList_.selections }
}