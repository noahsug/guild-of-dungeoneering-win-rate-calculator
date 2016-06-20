export default (state, action) => {
  if (state === undefined) {
    return {
      solving: false,
      result: undefined,
      heroHealth: 0,
      enemyHealth: 0,
      selectionType: 'HERO_HAND',
      enemyCardPlayed: undefined,
      selections: [],
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
        enemyCardPlayed: action.enemyCardPlayed,
        selections: action.selections,
      }

    default:
      return state
  }
}
