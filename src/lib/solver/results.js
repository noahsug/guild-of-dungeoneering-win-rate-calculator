import _ from '../../utils'

export default class Results {
  constructor() {
    // this.averageResult_ = _.simpleMovingAverage(200)
    this.results_ = new Map()
  }

  set bestMoveAccuracy(bestMoveAccuracy) {
    this.bestMoveAccuracy_ = bestMoveAccuracy
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
        wins: 0,
        count: 0,
        enemyCards: {},
      })
    }
    const stateStats = this.results_.get(state)
    stateStats.wins += result
    stateStats.count++
    return stateStats;
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
    for (const result of this.results_.values()) {
      count += result.count
      wins += result.wins
    }
    return wins / count
  }

  getStateResult_(state) {
    let count = 0
    let wins = 0
    const stateStats = this.results_.get(state)
    _.each(stateStats.enemyCards, (enemyCardStats) => {
      count += enemyCardStats.count
      _.each(enemyCardStats.winningMoves, (wins) => {
        wins += wins
      })
    })
    return wins / count
  }
}
