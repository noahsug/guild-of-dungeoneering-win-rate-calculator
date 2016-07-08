import { delay } from 'redux-saga'
import { race, call, fork, take, cancel, cancelled, select }
    from 'redux-saga/effects'
import { putp } from '../actions/utils'
import { getSolverInput } from '../selectors'
import { updateBreakdown } from './utils'

function* reset(solver) {
  const input = yield select(getSolverInput)
  solver.init(input)
}

function* solve(solver) {
  try {
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
    const { start } = yield race({
      resume: take('RESUME'),
      start: take('START'),
    })
    if (start) yield call(reset, solver)
    const solveTask = yield fork(solve, solver)
    yield take('STOP')
    yield cancel(solveTask)
  }
}
