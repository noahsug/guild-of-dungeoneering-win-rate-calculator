export default (state, action) => {
  if (state === undefined) {
    return {
      solving: false,
    }
  }

  switch (action.type) {
    case 'START':
      return {
        solving: true,
      }

    case 'RESULT':
      return {
        ...state,
        result: action.result,
      }

    case 'STOP':
      return {
        ...state,
        solving: false,
      }

    default:
      return state
  }
}
