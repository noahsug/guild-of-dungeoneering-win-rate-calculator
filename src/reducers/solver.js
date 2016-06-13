export default (state, action) => {
  if (state === undefined) {
    return {
      solving: false,
      result: undefined,
      playerHealth: 0,
      enemyHealth: 0,
      selectionType: 'PLAYER_HAND',
      prevSelection: undefined,
      nextSelections: [],
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
        playerHealth: action.playerHealth,
        enemyHealth: action.enemyHealth,
        selectionType: action.selectionType,
        prevSelection: action.prevSelection,
        nextSelections: action.nextSelections,
      }

    default:
      return state
  }
}
