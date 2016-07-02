import { connect } from 'react-redux'
import { useSelection } from '../actions'
import SelectionList from '../components/SelectionList'

const mapStateToProps = (state) => ({
  selections: state.solver.selections,
  selectionType: state.solver.selectionType,
  hero: {
    name: state.input.hero.name,
    health: state.solver.heroHealth,
  },
  enemy: {
    name: state.input.enemy.name,
    health: state.solver.enemyHealth,
  },
})

const mapDispatchToProps = (dispatch) => ({
  onClick: (value) => (
    dispatch(useSelection(value))
  ),
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectionList)
