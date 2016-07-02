import React, { PropTypes } from 'react'
import { List, ListSubHeader } from 'react-toolbox/lib/list';
import Selection from '../Selection'

const formatSelectionType = (selectionType) => {
  if (selectionType == 'HERO_HAND') return 'Possible hands'
  if (selectionType == 'ENEMY_CARD') return 'Possible enemy cards to play'
  if (selectionType == 'HERO_CARD') return 'Possible cards to play'
  return ''
}

const SelectionList = ({
    selections, onClick, selectionType }) => (
  <List selectable ripple>
    <ListSubHeader caption={formatSelectionType(selectionType)} />
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

SelectionList.propTypes = {
  selections: PropTypes.arrayOf(PropTypes.shape({
    result: PropTypes.number,
    cards: PropTypes.arrayOf(PropTypes.string),
  })).isRequired,
  selectionType: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default SelectionList
