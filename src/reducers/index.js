const solverApp = (state, action) => {
  switch (action.type) {
    case 'START':
      return {
        result: Math.random(),
        solving: true,
      };

    case 'STOP':
      return {
        ...state,
        solving: false,
      };

    default:
      return {
        solving: false,
      };
  }
};

export default solverApp;
