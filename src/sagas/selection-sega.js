import { take, call, fork, select } from 'redux-saga/effects'
import { putp } from '../actions/utils'
import { updateBreakdown } from './utils'
import { getResult } from '../selectors'

function* handleBack(solver) {
  while (true) {
    yield take('BACK')
    solver.back()
    yield call(updateBreakdown, solver)
  }
}

function* handleSelection(solver) {
  while (true) {
    const selection = yield take('SELECTION')
    solver.play(selection.selection)
    yield putp('RESUME')
    yield call(updateBreakdown, solver)
  }
}

export default function* selectionSaga(solver) {
  yield fork(handleSelection, solver)
  yield fork(handleBack, solver)
}
