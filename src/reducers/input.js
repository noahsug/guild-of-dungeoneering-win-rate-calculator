import _ from '../utils'

export default (state, action) => {
  if (state === undefined) {
    return {
      // hero: {
      //  name: 'Chump',
      //  items: ['Scroll Of Souls', 'Fez', 'Ocean Staff', 'Bark Vest'],
      //  traits: ['Crones Discipline'],
      // },
      // enemy: {
      //  name: 'Angry Bunny',
      //  traits: [],
      // },

      //hero: {
      //  name: 'Chump',
      //  items: [],
      //  traits: ['Crones Discipline'],
      //},
      //enemy: {
      //  name: 'Gray Ooze',
      //  traits: [],
      //},

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
      return {
        ...state,
        hasChanges: false,
      }

    default:
      return state
  }
}
