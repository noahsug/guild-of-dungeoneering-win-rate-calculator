import _ from '../utils'
import { Solver } from './solver'
import { gameData } from './game-engine'
import SelectionList from './selection-list'

export default class SolverApi {
  constructor() {
    this.solver_ = new Solver()
    this.selectionList_ = null
    this.smoothedResults_ = {}
  }

  init(input) {
    this.solver_.init(input.hero, input.enemy)
    this.selectionList_ = new SelectionList(this.solver_)
    this.resetResultSmoothing_()
  }

  * start() {
    this.running_ = true
    this.iterateResult_(10)
    yield
    while (this.running_) {
      this.iterateResult_(100)
      yield
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
    this.resetResultSmoothing_(selection.result)
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

  get result() {
    const result = this.selectionList_.result
    return this.smoothedResults_.result.update(result)
  }

  get selections() {
    if (this.solver_.solved) return []
    const selections = this.selectionList_.selections
    this.smoothSelectionResults_(selections)
    return selections
  }

  smoothSelectionResults_(sections) {
    sections.forEach((s, i) => {
      if (!this.smoothedResults_.selections[i]) {
        this.smoothedResults_.selections[i] = _.smoothNumber()
      }
      s.result = this.smoothedResults_.selections[i].update(s.result)
    })
  }

  resetResultSmoothing_(result) {
    this.smoothedResults_ = {
      result: _.smoothNumber(result),
      selections: [],
    }
  }
}
