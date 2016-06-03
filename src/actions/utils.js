import { put } from 'redux-saga/effects'
import * as actions from '.'
import _ from '../utils'

const actionFns = _.functions(actions).map(name => actions[name])
const actionTypes = actionFns.map(a => a().type)
const actionsByType = _.object(actionTypes, actionFns)

/**
 * Like put() but takes a pattern.
 * Usage:
 *   take('START')
 *   putp('RESULT', 5)
 */
export function putp(type, ...args) {
  const actionFn = _.assert(actionsByType[type])
  return put(actionFn.apply(null, args))
}
