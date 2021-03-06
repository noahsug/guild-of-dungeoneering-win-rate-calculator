import { PropTypes } from 'react'
import { connect } from 'react-redux'
import { updateInput } from '../actions'
import Input from '../components/Input'
import { gameData } from '../lib'
import _ from '../utils'

const filterTraits = (traits, selected) => {
  const selectedTypes = {}
  selected.forEach((name) => {
    const type = gameData.traits[name].type
    _.increment(selectedTypes, type)
  })

  return traits.filter((name) => {
    if (selected.includes(name)) return true
    const type = gameData.traits[name].type
    const numSelected = selectedTypes[type]
    return !type || !numSelected ||
        (numSelected === 1 && type === 'battle scar')
  })
}

const filterItems = (items, selected) => {
  const selectedTypes = {}
  selected.forEach((name) => {
    const type = gameData.items[name].slot
    selectedTypes[type] = true
  })

  return items.filter((name) => {
    if (selected.includes(name)) return true
    const type = gameData.items[name].slot
    return !type || !selectedTypes[type]
  })
}

const getNameSource = (state, player) => {
  const key = player === 'hero' ? 'heroes' : 'enemies'
  return Object.keys(gameData[key])
}

const getItemSource = (state, player) => {
  const items = Object.keys(gameData.items)
  return filterItems(items, state.input[player].items)
}

const getTraitSource = (state, player) => {
  const key = player === 'hero' ? 'heroes' : 'enemies'
  const traits = []
  _.each(gameData.traits, (trait, name) => {
    if (trait.for === player) traits.push(name)
  })
  const name = state.input[player].name
  if (gameData[key][name]) {
    traits.push(...gameData[key][name].situationalTraits || [])
  }
  return filterTraits(traits, state.input[player].traits)
}

const getSource = (state, player, prop) => {
  switch (prop) {
    case 'name': return getNameSource(state, player)
    case 'items': return getItemSource(state, player)
    case 'traits': return getTraitSource(state, player)
  }
  return _.fail('invalid input name:', prop)
}

const mapStateToProps = (state, ownProps) => {
  const value = state.input[ownProps.player][ownProps.prop]
  const source = getSource(state, ownProps.player, ownProps.prop)
  const multiple = ['traits', 'items'].includes(ownProps.prop)
  return {
    value,
    source,
    multiple,
    label: ownProps.label,
    disabled: !multiple && state.breakdown.solving,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onChange: (value) => (
    dispatch(updateInput(ownProps.player, ownProps.prop, value))
  ),
})

const SolverInput = connect(mapStateToProps, mapDispatchToProps)(Input)

SolverInput.propTypes = {
  label: PropTypes.string.isRequired,
  player: PropTypes.string.isRequired,
  prop: PropTypes.string.isRequired,
}

export default SolverInput
