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

export const updateInput = (user, prop, value) => ({
  type: 'INPUT_CHANGED',
  user,
  prop,
  value,
})
