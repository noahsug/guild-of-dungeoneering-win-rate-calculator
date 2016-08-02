import _ from '../utils'
import { gameData } from '../lib'

function saveState(state) {
  _.store.setObj('input', { ...state, hasChanges: true })
}

function clearSituationalTraits(state, player, newName) {
  const key = player === 'hero' ? 'heroes' : 'enemies'
  const prevTraits = gameData[key][state[player].name].situationalTraits || []
  const newTraits = gameData[key][newName].situationalTraits || []
  state[player].traits = state[player].traits.filter(t => {
    return !prevTraits.includes(t) || newTraits.includes(t)
  })
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
      if (action.prop === 'name') {
        // Clear old situation traits when switching players.
        clearSituationalTraits(state, action.player, action.value)
      }
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
