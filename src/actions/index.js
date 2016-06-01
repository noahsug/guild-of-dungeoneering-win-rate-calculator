export const startSolving = () => ({
  type: 'START',
})

export const updateResult = (result) => ({
  type: 'RESULT',
  result,
})

export const stopSolving = () => ({
  type: 'STOP',
})

export const updateInput = (user, prop, value) => ({
  type: 'INPUT_CHANGED',
  user,
  prop,
  value,
})
