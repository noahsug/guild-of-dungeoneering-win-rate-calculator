import { delay } from 'redux-saga'
import { call, fork, take, cancel } from 'redux-saga/effects'
import { putp } from '../actions/utils'

function getResult() {
  return Math.random()
}

function* solve() {
  try {
    for (let i = 0; i < 1000; i++) {
      const result = getResult()
      yield putp('RESULT', result)
      yield call(delay, 10)
    }
  } catch (e) {
    yield putp('STOP')
  }
}

export default function* solverSaga() {
  while (true) {
    yield take('START')
    const solveTask = yield fork(solve)
    yield take('STOP')
    yield cancel(solveTask)
  }
}
