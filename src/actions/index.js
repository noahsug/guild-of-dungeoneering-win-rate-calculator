export const startSolving = () => ({
  type: 'START',
})

export const stopSolving = () => ({
  type: 'STOP',
})

export const updateBreakdown = (data = {}) => {
  data.type = 'BREAKDOWN'
  return data
}

export const updateInput = (player, prop, value) => ({
  type: 'INPUT_CHANGED',
  player,
  prop,
  value,
})
