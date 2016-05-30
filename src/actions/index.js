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
