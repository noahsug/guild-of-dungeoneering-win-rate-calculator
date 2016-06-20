import React, { PropTypes } from 'react'
import Selection from '../Selection'

const SelectionList = ({ selections, onClick }) => (
  <div>
    {selections.map(({ result, cards }, i) => (
      <Selection
        result={result}
        cards={cards}
        onClick={onClick}
        key={i}
      />
    ))}
  </div>
)

SelectionList.propTypes = {
  selections: PropTypes.arrayOf(PropTypes.shape({
    result: PropTypes.number,
    cards: PropTypes.arrayOf(PropTypes.string),
  })).isRequired,
  onClick: PropTypes.func.isRequired,
}

export default SelectionList
