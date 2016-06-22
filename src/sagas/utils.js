import { putp } from '../actions/utils'

export function* updateBreakdown(solver) {
  yield putp('BREAKDOWN', {
    result: solver.result,
    heroHealth: solver.heroHealth,
    enemyHealth: solver.enemyHealth,
    selectionType: solver.selectionType,
    selections: solver.selections,
    lastSelected: solver.lastSelected,
  })
}
