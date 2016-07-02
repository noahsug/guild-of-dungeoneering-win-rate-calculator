import React, { PropTypes } from 'react'
import { ListItem } from 'react-toolbox/lib/list';

const formatResult = (result) => (
  `${result * 100 | 0}%`
)

const Selection = ({ result, cards, onClick }) => {
  onClick = onClick.bind(null, cards)
  return (
    <ListItem
      onClick={onClick}
      caption={cards.join(' ')}
      legend={`${formatResult(result)} chance to win`}
    />
  )
}

Selection.propTypes = {
  result: PropTypes.number.isRequired,
  cards: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClick: PropTypes.func.isRequired,
}

export default Selection
