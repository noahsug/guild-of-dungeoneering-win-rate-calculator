import _ from '../../utils'

export default class Results {
  constructor() {
    this.results_ = new Map()

    // If a player move wins this many times, it's selected as the best and
    // other possible player moves are pruned.
    this.bestMovePruning_ = Infinity
  }

  set bestMovePruning(bestMovePruning) {
    this.bestMovePruning_ = bestMovePruning
  }

  set states(states) {
    this.states_ = states
    this.smaPeriod_ = Math.max(4, Math.ceil(200 / states.length))
  }

  recordResult(state, enemyCard, winningMove) {
    const result = winningMove && 1
    const stateResults = this.updateStateResult(state, result)
    const enemyCardResults = this.updateEnemyCardResult(
        stateResults.enemyCards, enemyCard)
    this.updatePlayerCardResult(
        enemyCardResults.winningMoves, winningMove, result)
  }

  updateStateResult(state, result) {
    if (!this.results_.has(state)) {
      this.results_.set(state, {
        sma: _.simpleMovingAverage(this.smaPeriod_),
        enemyCards: {},
      })
    }
    const stateStats = this.results_.get(state)
    stateStats.sma.add(result)
    if (stateStats.sma.iterations % 5 === 0) {
      stateStats.sma.period++
    }
    return stateStats
  }

  updateEnemyCardResult(enemyCards, enemyCard) {
    if (!enemyCards[enemyCard]) {
      enemyCards[enemyCard] = {
        winningMoves: {},
        count: 0,
      }
    }
    const enemyCardStats = enemyCards[enemyCard]
    enemyCardStats.count++
    return enemyCardStats
  }

  updatePlayerCardResult(winningMoves, playerCard, result) {
    if (!winningMoves[playerCard]) {
      winningMoves[playerCard] = 0
    }
    winningMoves[playerCard] += result
  }

  getResult(state, enemyCard, playerCard) {
    if (state === undefined) {
      return this.getOverallResult_()
    }
    if (enemyCard === undefined) {
      return this.getStateResult_(state)
    }
    if (playerCard === undefined) {
      return this.getEnemyCardResult_(state, enemyCard)
    }
    return this.getPlayerCardResult_(state, enemyCard, playerCard)
  }

  getOverallResult_() {
    let count = 0
    let wins = 0
    this.states_.forEach(state => {
      if (!this.results_.has(state)) return
      const { sma } = this.results_.get(state)
      count += sma.count
      wins += sma.sum
    })
    return wins / count
  }

  getStateResult_(state) {
    const stateResults = this.results_.get(state)
    if (!stateResults) return NaN
    return stateResults.sma.value
  }

  getEnemyCardResult_(state, enemyCard) {
    let wins = 0
    const stateResults = this.results_.get(state)
    if (!stateResults) return NaN
    const enemyCardResults = stateResults.enemyCards[enemyCard] || {}
    _.each(enemyCardResults.winningMoves, (cardWins) => {
      wins += cardWins
    })
    return wins / enemyCardResults.count
  }

  getPlayerCardResult_(state, enemyCard, playerCard) {
    let wins = 0
    const stateResults = this.results_.get(state)
    if (!stateResults) return NaN
    const enemyCardResults = stateResults.enemyCards[enemyCard]
    if (!enemyCardResults) return NaN
    const selectedCardWins = enemyCardResults.winningMoves[playerCard]
    if (!selectedCardWins) return 0

    let bestWins = 0
    _.each(enemyCardResults.winningMoves, (cardWins) => {
      wins += cardWins
      if (cardWins > bestWins) bestWins = cardWins
    })

    const winRate = wins / enemyCardResults.count
    if (selectedCardWins > this.bestMovePruning_) {
      return winRate
    }
    const maxWins = Math.min(bestWins, this.bestMovePruning_)
    return winRate * selectedCardWins / maxWins
  }
}
