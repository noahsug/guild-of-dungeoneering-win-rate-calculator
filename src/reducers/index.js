const solverApp = (state, action) => {
  switch (action.type) {
    case 'START':
      return {
        ...state,
        solving: true,
      };

    case 'RESULT':
      return {
        ...state,
        result: action.result,
      };

    default:
      return {
        ...state,
        solving: false,
      };
  }
};

export default solverApp;
