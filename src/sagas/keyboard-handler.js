import { call, select } from 'redux-saga/effects'
import { putp } from '../actions/utils'
import { getSolverInput, getIsSolving } from '../selectors'

function awaitKeyDown(keyCode) {
  return new Promise((resolve, reject) => {
    function handleEvent(e) {
      if (e.code === keyCode) {
        window.removeEventListener('keydown', handleEvent)
        resolve()
      }
    }
    window.addEventListener('keydown', handleEvent)
  })
}

export default function* keyboardHandler() {
  while (true) {
    yield call(awaitKeyDown, 'Enter')
    const isSolving = yield select(getIsSolving)
    if (isSolving) {
      yield putp('STOP')
    } else {
      const input = yield select(getSolverInput)
      input.hasChanges ? yield putp('START') : yield putp('RESUME')
    }
  }
}
