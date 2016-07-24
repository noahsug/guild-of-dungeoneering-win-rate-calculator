import { call } from 'redux-saga/effects'
import { putp } from '../actions/utils'

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
    yield putp('START')
  }
}
