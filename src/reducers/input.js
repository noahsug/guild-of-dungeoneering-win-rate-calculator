import _ from '../utils'

export default (state, action) => {
  if (state === undefined) {
    return {
      player: {
        name: '',
        items: [],
        traits: [],
      },
      enemy: {
        name: '',
        traits: [],
      },
    }
  }

  switch (action.type) {
    case 'INPUT_CHANGED':
      state = _.deepClone(state)
      state[action.user][action.prop] = action.value
      return state

    default:
      return state
  }
}
