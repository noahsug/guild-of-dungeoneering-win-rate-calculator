import React, { PropTypes } from 'react'
import { CardText } from 'react-toolbox/lib/card'
import { List, ListSubHeader } from 'react-toolbox/lib/list'
import classNames from 'classnames/bind'
import Selection from '../Selection'
import Filter from '../Filter'
import style from './SelectionList.scss'
import { filterSelections }  from './selection-filter.js'

const cx = classNames.bind(style)

const getSelectionDesc = (selectionType, isFirstSelection) => {
  if (isFirstSelection) return 'Possible starting hands'
  if (selectionType === 'HERO_HAND') return 'Possible hands'
  if (selectionType === 'ENEMY_CARD') return 'Possible enemy cards to play'
  if (selectionType === 'HERO_CARD') return 'Possible cards to play'
  return ''
}

const maybeGetFilter = ({ selections, filter, setFilter }) => {
  if (!filter && selections.length <= 5) return <div />
  return (
    <CardText className={cx('filter')}>
      <Filter filter={filter} setFilter={setFilter} />
    </CardText>
  )
}

const SelectionList = ({
    selections, onClick, selectionType, isFirstSelection,
    filter, setFilter }) => {
  selections = filterSelections(selections, filter)
  if (!filter && selections.length === 0) return null
  return (
    <List selectable ripple className={cx('content')}>
      {maybeGetFilter({ selections, filter, setFilter })}
      <ListSubHeader caption={getSelectionDesc(selectionType, isFirstSelection)}
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
  filter: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
}

export default SelectionList
