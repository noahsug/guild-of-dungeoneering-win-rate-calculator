import { delay } from 'redux-saga'
import { call, fork, take, cancel, cancelled, select } from 'redux-saga/effects'
import { putp } from '../actions/utils'
import { getSolverInput } from '../selectors'
import { updateBreakdown } from './utils'

function* solve(solver) {
  try {
    const input = yield select(getSolverInput)
    solver.init(input)
    const resultGen = solver.start()
    for (let i = 0; i < 1000; i++) {
      resultGen.next()
      yield call(updateBreakdown, solver)
      yield call(delay, 5)
    }
  } catch (e) {
    console.error(e)  // eslint-disable-line no-console
  } finally {
    if (yield cancelled()) solver.stop()
    else yield putp('STOP')
  }
}

export default function* solverSaga(solver) {
  while (true) {
    yield take('START')
    const solveTask = yield fork(solve, solver)
    yield take('STOP')
    yield cancel(solveTask)
  }
}
