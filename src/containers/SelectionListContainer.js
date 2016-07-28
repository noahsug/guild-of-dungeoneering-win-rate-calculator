import { connect } from 'react-redux'
import { useSelection, filterSelections } from '../actions'
import SelectionList from '../components/SelectionList'

const mapStateToProps = (state) => ({
  selections: state.breakdown.selections,
  selectionType: state.breakdown.selectionType,
  isFirstSelection: !state.breakdown.lastSelected,
  hero: {
    name: state.input.hero.name,
    health: state.breakdown.heroHealth,
  },
  enemy: {
    name: state.input.enemy.name,
    health: state.breakdown.enemyHealth,
  },
  filter: state.breakdown.selectionFilter,
})

const mapDispatchToProps = (dispatch) => ({
  onClick: (value) => (
    dispatch(useSelection(value))
  ),
  setFilter: (filter) => (
    dispatch(filterSelections(filter))
  ),
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectionList)
