import { connect } from 'react-redux'
import { useSelection } from '../actions'
import SelectionList from '../components/SelectionList'

const mapStateToProps = (state) => ({
  selections: state.solver.selections,
})

const mapDispatchToProps = (dispatch) => ({
  onClick: (value) => (
    dispatch(useSelection(value))
  ),
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectionList)
