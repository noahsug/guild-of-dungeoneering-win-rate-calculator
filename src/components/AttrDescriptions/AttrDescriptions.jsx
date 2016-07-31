import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Link from 'react-toolbox/lib/link'
import tooltipify from 'react-toolbox/lib/tooltip'
import classNames from 'classnames/bind'
import _ from '../../utils'
import style from './AttrDescriptions.scss'
import linkTheme from '../themes/link-theme.scss'
import { gameData } from '../../lib'

const cx = classNames.bind(style)
const TooltipIcon = tooltipify(Link)

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

const AttrDescriptions = ({ visible, tooltip }) => {
  if (!visible) return null
  return (
    <TooltipIcon
      label="?"
      className={cx('content')}
      tooltip={tooltip}
      theme={linkTheme}
    />
  )
}

AttrDescriptions.propTypes = {
  visible: PropTypes.bool.isRequired,
  tooltip: PropTypes.string.isRequired,
}

export default connect(mapStateToProps)(AttrDescriptions)
