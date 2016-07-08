import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import ToolboxProgressBar from 'react-toolbox/lib/progress_bar'

const mapStateToProps = (state) => ({
  solving: state.breakdown.solving,
})

const ProgressBar = ({ solving }) => {
  if (!solving) return null
  return <ToolboxProgressBar type="linear" mode="indeterminate" />
}

ProgressBar.propTypes = {
  solving: PropTypes.bool.isRequired,
}

export default connect(mapStateToProps)(ProgressBar)
