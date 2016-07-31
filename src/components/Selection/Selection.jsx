import React, { PropTypes } from 'react'
import { ListItem } from 'react-toolbox/lib/list'
import classNames from 'classnames/bind'
import style from './Selection.scss'

const cx = classNames.bind(style)

const formatResult = (result) => (
  `${result * 100 | 0}%`
)

const Selection = ({ result, cards, highlight, onClick }) => {
  onClick = onClick.bind(null, cards)
  return (
    <ListItem
      ripple
      selectable
      className={cx({highlight})}
      onClick={onClick}
      caption={cards.join(' ')}
      legend={`${formatResult(result)} chance to win`}
    />
  )
}

Selection.propTypes = {
  result: PropTypes.number.isRequired,
  cards: PropTypes.arrayOf(PropTypes.string).isRequired,
  highlight: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
}

export default Selection
