import _ from 'underscore';

export const updateResult = (result) => ({
  type: 'RESULT',
  result,
});

export const stopSolving = () => ({
  type: 'STOP',
});

const incrementalSolve = (dispatch, getState) => {
  if (!getState().solving) return;
  const result = Math.random();
  dispatch(updateResult(result));
  setTimeout(_.partial(incrementalSolve, dispatch, getState), 500);
};

export const startSolving = () => (
  (dispatch, getState) => {
    dispatch({ type: 'START' });
    incrementalSolve(dispatch, getState);
  }
);
