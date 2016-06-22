import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { goBack } from '../actions'
import Button from 'react-toolbox/lib/button'

const mapStateToProps = (state) => ({
  visible: !!state.solver.lastSelected,
})

const mapDispatchToProps = (dispatch) => ({
  back: () => dispatch(goBack()),
})

const BackButton = ({ visible, back }) => {
  if (!visible) return <div></div>
  return <Button onClick={back}>Back</Button>
}

BackButton.propTypes = {
  visible: PropTypes.bool.isRequired,
  back: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(BackButton)
