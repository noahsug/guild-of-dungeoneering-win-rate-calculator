import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { startSolving, stopSolving, resumeSolving } from '../actions'
import Button from 'react-toolbox/lib/button'

const mapStateToProps = (state) => {
  let accent = false
  let label, action
  if (state.breakdown.solving) {
    label = 'Stop'
    action = 'stop'
  } else if (state.input.hasChanges) {
    label = 'Calculate Win Rate'
    action = 'start'
    accent = true
  } else {
    label = 'Resume'
    action = 'resume'
  }
  return { accent, label, action }
}

const mapDispatchToProps = (dispatch) => ({
  stop: () => dispatch(stopSolving()),
  start: () => dispatch(startSolving()),
  resume: () => dispatch(resumeSolving()),
})

const SolveButton = (props) => {
  const { label, action, accent } = props
  return <Button label={label} onClick={props[action]} accent={accent} />
}

SolveButton.propTypes = {
  label: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  accent: PropTypes.bool,
  stop: PropTypes.func.isRequired,
  start: PropTypes.func.isRequired,
  resume: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(SolveButton)
