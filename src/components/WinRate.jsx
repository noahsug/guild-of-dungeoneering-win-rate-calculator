import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  result: state.solver.result,
});

const formatResult = (result) => (
  `${result * 100 | 0} %`
);

const WinRate = ({ result }) => {
  if (result === undefined) return <div></div>;
  return <div>Win Rate: {formatResult(result)}</div>;
};

WinRate.propTypes = {
  result: PropTypes.number,
};

export default connect(mapStateToProps)(WinRate);
