import _ from '../../utils'

export default class Results {
  constructor() {
    this.count = 0
    this.averageResult_ = _.simpleMovingAverage(200)
  }

  set bestMoveAccuracy(bestMoveAccuracy) {
    this.bestMoveAccuracy_ = bestMoveAccuracy
  }

  setState(state) {
  }

  recordResult(state, playerCard, enemyCard, result) {
    this.averageResult_.add(result)

    // if (this.count % (this.states.length * 5) == 0) {
    //  this.averageResult_.period += this.states.length;
    // }


    // if (!state.stats) {
    //  state.stats = {
    //    wins: 0,
    //    count: 0,
    //    enemyCards: {}
    //  }
    // }
    // if (!state.stats.enemyCards[enemyCard]) {
    //  state.stats.enemyCards[enemyCard] = {
    //    playerCardWins: {},
    //    count: 0,
    //  }
    // }
    // if (!state.stats.enemyCards[enemyCard].playerCardWins[playerCard]) {
    //  state.stats.enemyCards[enemyCard].playerCardWins[playerCard] = 0
    // }
    //
    // state.stats.wins += result;
    // state.stats.count++;
    // state.stats.enemyCards[enemyCard].playerCardWins[playerCard] += result
    // state.stats.enemyCards[enemyCard].count++;
  }

  get value() {
    return this.averageResult_.value
  }
}
