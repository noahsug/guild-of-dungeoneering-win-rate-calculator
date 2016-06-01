import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { updateInput } from '../actions'
import Input from '../components/Input'
import _ from '../utils'

const mapStateToProps = (state, ownProps) => {
  const value = state.input[ownProps.user][ownProps.prop];
  const source = ['Chump', 'Bruiser', 'Noah'];
  //const multiple = ['traits', 'items'].includes(ownProps.prop);
  const multiple = true;
  return {
    value,
    source,
    multiple,
    label: ownProps.label,
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onChange: (value) => (
    dispatch(updateInput(ownProps.user, ownProps.prop, value))
  )
})

const SolverInput = connect(mapStateToProps, mapDispatchToProps)(Input)

SolverInput.propTypes = {
  label: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  prop: PropTypes.string.isRequired,
}

export default SolverInput
