import { takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { updateResult } from '../actions'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function* solve() {
  yield call(delay, 500)
  yield put(updateResult(0.5))
}

export default function* solveSaga() {
  yield* takeLatest('START', solve)
}
