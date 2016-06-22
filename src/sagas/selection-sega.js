import { take, call, fork } from 'redux-saga/effects'
import { updateBreakdown } from './utils'

export default function* handleBack(solver) {
  while (true) {
    yield take('BACK')
    solver.back()
    yield call(updateBreakdown, solver)
  }
}

export default function* handleSelection(solver) {
  while (true) {
    const selection = yield take('SELECTION')
    solver.play(selection.selection)
    yield call(updateBreakdown, solver)
  }
}

export default function* selectionSaga(solver) {
  yield fork(handleSelection, solver)
  yield fork(handleBack, solver)
}
