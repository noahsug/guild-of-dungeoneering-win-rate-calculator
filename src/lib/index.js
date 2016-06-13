import { Solver } from './solver'

class SolverApi {
  constructor() {
    this.solver_ = new Solver()
    this.selection_ = {
      state: null,
      enemyCard: null,
    }
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
  }

  back() {
  }

  get selectionType() {
    return 'HERO_HAND'
  }

  get result() {
    return this.solver_.getResult()
  }

  get heroHealth() {
    return this.solver_.state.children[0].hero.health
  }

  get enemyHealth() {
    return this.solver_.state.children[0].hero.health
  }

  get enemyCardPlayed() {
    return undefined
  }

  get heroCardPlayed() {
    return undefined
  }

  get heroHand() {
    return undefined
  }

  get nextSelections() {
    return [
      { cards: ['P', 'P/P', 'B'], result: 0.8 },
      { cards: ['P', 'P', 'B'], result: 0.5 },
      { cards: ['P', 'B', 'B'], result: 0.5 },
      { cards: ['P', 'P', 'P'], result: 0.3 },
    ]
  }
}

export default {
  solver: new SolverApi(),
}
