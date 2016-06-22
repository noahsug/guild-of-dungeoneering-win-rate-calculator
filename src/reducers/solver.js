export default (state, action) => {
  if (state === undefined) {
    return {
      solving: false,
      result: undefined,
      heroHealth: 0,
      enemyHealth: 0,
      selectionType: 'HERO_HAND',
      selections: [],
      lastSelected: undefined,
    }
  }

  switch (action.type) {
    case 'START':
      return {
        ...state,
        solving: true,
        result: undefined,
      }

    case 'STOP':
      return {
        ...state,
        solving: false,
      }

    case 'BREAKDOWN':
      return {
        ...state,
        result: action.result,
        heroHealth: action.heroHealth,
        enemyHealth: action.enemyHealth,
        selectionType: action.selectionType,
        selections: action.selections,
        lastSelected: action.lastSelected,
      }

    default:
      return state
  }
}
