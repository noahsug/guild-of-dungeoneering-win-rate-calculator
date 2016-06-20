import React, { PropTypes } from 'react'

const Selection = ({ result, cards, onClick }) => {
  onClick = onClick.bind(null, cards)
  return (
    <div onClick={onClick}>
      Cards: {cards.join(' ')} Win Rate: {result}
    </div>
  )
}

Selection.propTypes = {
  result: PropTypes.number.isRequired,
  cards: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClick: PropTypes.func.isRequired,
}

export default Selection
