import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Button from 'react-toolbox/lib/button'
import tooltipify from 'react-toolbox/lib/tooltip'
import classNames from 'classnames/bind'
import _ from '../../utils'
import style from './AttrDescriptionsButton.scss'
import { gameData } from '../../lib'

const cx = classNames.bind(style)
const TooltipButton = tooltipify(Button)

function getAttrDescription(attr) {
  return _.s.humanize(gameData.CARD_ATTRS[attr])
}

function getTooltip(selections) {
  return _.chain(selections)
    .pluck('cards')
    .flatten()
    .expand(desc => desc.split(gameData.CARD_DELIMITER))
    .unique()
    .tap(attrs => attrs.sort())
    .map(attr => `${attr}: ${getAttrDescription(attr)}`)
    .join('\n')
    .value()
}

const mapStateToProps = (state) => ({
  visible: !!state.breakdown.selections.length,
  tooltip: getTooltip(state.breakdown.selections),
})

const AttrDescriptionsButton = ({ visible, tooltip }) => {
  if (!visible) return null
  return (
    <TooltipButton className={cx('content')} icon="help" tooltip={tooltip} />
  )
}

AttrDescriptionsButton.propTypes = {
  visible: PropTypes.bool.isRequired,
  tooltip: PropTypes.string.isRequired,
}

export default connect(mapStateToProps)(AttrDescriptionsButton)
