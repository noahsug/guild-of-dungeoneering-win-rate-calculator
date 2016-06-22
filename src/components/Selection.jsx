import React, { PropTypes } from 'react'

const formatResult = (result) => (
  `${result * 100 | 0} %`
)

const Selection = ({ result, cards, onClick }) => {
  onClick = onClick.bind(null, cards)
  return (
    <div onClick={onClick}>
      {cards.join(' ')} (Win Rate: {formatResult(result)})
    </div>
  )
}

Selection.propTypes = {
  result: PropTypes.number.isRequired,
  cards: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClick: PropTypes.func.isRequired,
}

export default Selection
