import React, { PropTypes } from 'react'
import { CardActions } from 'react-toolbox/lib/card'
import { connect } from 'react-redux'
import { goBack } from '../actions'
import Button from 'react-toolbox/lib/button'
import buttonTheme from './themes/button-theme.scss'

const mapStateToProps = (state) => ({
  visible: !!state.breakdown.lastSelected,
})

const mapDispatchToProps = (dispatch) => ({
  back: () => dispatch(goBack()),
})

const BackButton = ({ visible, back }) => {
  if (!visible) return null
  return (
    <CardActions>
      <Button theme={buttonTheme} onClick={back} label="back" />
    </CardActions>
  )
}

BackButton.propTypes = {
  visible: PropTypes.bool.isRequired,
  back: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(BackButton)
