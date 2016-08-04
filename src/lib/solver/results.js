import _ from '../../utils'

export default class Results {
  constructor() {
    this.results_ = {}

    // If a hero move wins this many times, it's selected as the best and
    // other possible hero moves are pruned.
    this.bestMovePruning_ = Infinity
  }

  set bestMovePruning(bestMovePruning) {
    this.bestMovePruning_ = bestMovePruning
  }

  set states(states) {
    this.states_ = states
    this.smaPeriod_ = Math.max(4, Math.ceil(200 / states.length))
  }

  // winningMove will be 0 if no winning move was found.
  recordResult(state, enemyCard, winningMove) {
    const byHeroCard = this.getResultsByHeroCard_(state, enemyCard)
    if (winningMove) {
      byHeroCard[winningMove] = byHeroCard[winningMove] + 1 || 1
      byHeroCard.sma.add(1)
    } else {
      byHeroCard.sma.add(0)
    }
  }

  getResultsByHeroCard_(state, enemyCard) {
    let byEnemyCard = this.results_[state.id]
    if (!byEnemyCard) byEnemyCard = this.results_[state.id] = {}

    let byHeroCard = byEnemyCard[enemyCard]
    if (!byHeroCard) {
      const period = Math.round(this.smaPeriod_ * Math.sqrt(state.weight))
      byHeroCard = byEnemyCard[enemyCard] = {
        sma: _.simpleMovingAverage(period),
      }
    }
    return byHeroCard
  }

  getResult(state, enemyCard, heroCard) {
    if (state === undefined) {
      return this.getOverallResult_()
    }
    if (enemyCard === undefined) {
      return this.getStateResult_(this.results_[state.id] || [])
    }
    const byHeroCard = this.getResultsByHeroCard_(state, enemyCard)
    if (heroCard === undefined) {
      return this.getEnemyCardResult_(byHeroCard)
    }
    return this.getHeroCardResult_(byHeroCard, heroCard)
  }

  getOverallResult_() {
    let sum = 0
    let count = 0
    this.states_.forEach(state => {
      const byEnemyCard = this.results_[state.id]
      if (!byEnemyCard) return
      sum += this.getStateResult_(byEnemyCard) * state.weight
      count += state.weight
    })
    return sum / count
  }

  getStateResult_(byEnemyCard) {
    let sum = 0
    let count = 0
    _.each(byEnemyCard, byHeroCard => {
      if (!byHeroCard) return
      const result = this.getEnemyCardResult_(byHeroCard)
      if (isNaN(result)) return
      sum += result
      count++
    })
    return sum / count
  }

  getEnemyCardResult_(byHeroCard) {
    return byHeroCard.sma.value
  }

  getHeroCardResult_(byHeroCard, heroCard) {
    if (!byHeroCard[heroCard]) return 0
    let bestWins = 0
    _.each(byHeroCard, wins => {
      if (wins > bestWins) bestWins = wins
    })
    const ratio =
        Math.min(byHeroCard[heroCard], this.bestMovePruning_) /
        Math.min(bestWins, this.bestMovePruning_)
    return byHeroCard.sma.value * ratio
  }
}
