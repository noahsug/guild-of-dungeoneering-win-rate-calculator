export const startSolving = () => ({
  type: 'START',
})

export const stopSolving = () => ({
  type: 'STOP',
})

export const resumeSolving = () => ({
  type: 'RESUME',
})

export const updateBreakdown = (data = {}) => {
  data.type = 'BREAKDOWN'
  return data
}

export const useSelection = (selection) => ({
  type: 'SELECTION',
  selection,
})

export const goBack = () => ({
  type: 'BACK',
})

export const updateInput = (player, prop, value) => ({
  type: 'INPUT_CHANGED',
  player,
  prop,
  value,
})
