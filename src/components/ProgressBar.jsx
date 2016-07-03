import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import ToolboxProgressBar from 'react-toolbox/lib/progress_bar'

const mapStateToProps = (state) => ({
  solving: state.solver.solving,
})

const ProgressBar = ({ solving }) => (
  solving ?
    <ToolboxProgressBar type="linear" mode="indeterminate" /> :
    <div />
)

ProgressBar.propTypes = {
  solving: PropTypes.bool.isRequired,
}

export default connect(mapStateToProps)(ProgressBar)
