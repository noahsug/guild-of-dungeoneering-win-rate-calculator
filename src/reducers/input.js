import _ from '../utils'

function saveState(state) {
  _.store.setObj('input', { ...state, hasChanges: true })
}

export default (state, action) => {
  if (state === undefined) {
    return _.store.getObj('input') || {
      hero: {
        name: 'Chump',
        items: [],
        traits: [],
      },
      enemy: {
        name: 'Nasty Rat',
        traits: [],
      },
      hasChanges: true,
    }
  }

  switch (action.type) {
    case 'INPUT_CHANGED':
      state = _.deepClone(state)
      state[action.player][action.prop] = action.value
      state.hasChanges = true
      return state

    case 'START':
      saveState(state)
      return {
        ...state,
        hasChanges: false,
      }

    default:
      return state
  }
}
