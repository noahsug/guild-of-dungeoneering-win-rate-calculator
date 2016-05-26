import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { startSolving, stopSolving } from '../actions';
import Button from 'react-toolbox/lib/button';

const mapStateToProps = (state) => ({
  solving: state.solving,
});

const mapDispatchToProps = (dispatch) => ({
  start: () => dispatch(startSolving()),
  stop: () => dispatch(stopSolving()),
});

const SolveButton = ({ solving, start, stop }) => (
  <Button
    label={solving ? 'Stop' : 'Calculate Win Rate'}
    accent={!solving}
    raised
    onClick={solving ? stop : start}
  />
);

SolveButton.propTypes = {
  solving: PropTypes.bool.isRequired,
  start: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SolveButton);
