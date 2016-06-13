import { delay } from 'redux-saga'
import { call, fork, take, cancel, cancelled, select } from 'redux-saga/effects'
import { putp } from '../actions/utils'
import { getSolverInput } from '../selectors'
import { solver } from '../lib'

//function getBreakdown(playerHand, enemyCard, playerCard) {
//  const states = solver.getStates(playerHand, enemyCard, playerCard)
//  return {
//    playerHealth: solver,
//    enemyHealth: solver.enemyHealth,
//    states,
//  }
//}
//
//function* selectionHandler() {
//  try {
//    const selection = yield take('SELECTION')
//  } finally {
//    // pass
//  }
//}

function* updateBreakdown() {
  yield putp('BREAKDOWN', {
    result: solver.result,
    playerHealth: solver.playerHealth,
    enemyHealth: solver.enemyHealth,
    selectionType: solver.selectionType,
    prevSelection: undefined,
    nextSelections: solver.nextSelections,
  })

}

function* solve() {
  try {
    const input = yield select(getSolverInput)
    solver.init(input)
    const resultGen = solver.start()
    for (let i = 0; i < 100; i++) {
      resultGen.next()
      yield call(updateBreakdown)
      yield call(delay, 5)
    }
  } finally {
    if (yield cancelled()) solver.stop()
    else yield putp('STOP')
  }
}

export default function* solverSaga() {
  while (true) {
    yield take('START')
    const solveTask = yield fork(solve)
    //const selectionHandler = yield fork(selectionHandler)
    yield take('STOP')
    //yield cancel(selectionHandler)
    yield cancel(solveTask)
  }
}
