import React, { PropTypes } from 'react'
import { List, ListSubHeader } from 'react-toolbox/lib/list'
import Selection from '../Selection'

const getSelectionDesc = (selectionType, isFirstSelection) => {
  if (isFirstSelection) return 'Possible starting hands'
  if (selectionType === 'HERO_HAND') return 'Possible hands'
  if (selectionType === 'ENEMY_CARD') return 'Possible enemy cards to play'
  if (selectionType === 'HERO_CARD') return 'Possible cards to play'
  return ''
}

const SelectionList = ({
    selections, onClick, selectionType, isFirstSelection }) => {
  if (selections.length === 0) return null
  return (
    <List selectable ripple>
      <ListSubHeader
        caption={getSelectionDesc(selectionType, isFirstSelection)}
      />
      {selections.map(({ result, cards }, i) => (
        <Selection
          result={result}
          cards={cards}
          onClick={onClick}
          key={i}
        />
      ))}
    </List>
  )
}

SelectionList.propTypes = {
  selections: PropTypes.arrayOf(PropTypes.shape({
    result: PropTypes.number,
    cards: PropTypes.arrayOf(PropTypes.string),
  })).isRequired,
  selectionType: PropTypes.string.isRequired,
  isFirstSelection: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default SelectionList
