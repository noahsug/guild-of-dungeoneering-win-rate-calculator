import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { updateInput } from '../actions'
import Input from '../components/Input'
import { gameData } from '../lib'
import _ from '../utils'

const filterTraits = (traits, selected) => {
  const selectedTypes = {}
  selected.forEach((name) => {
    const type = gameData.traits[name].type
    selectedTypes[type] = true
  })

  return traits.filter((name) => {
    if (selected.includes(name)) return true
    const type = gameData.traits[name].type
    return !type || !selectedTypes[type]
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

const getSource = (state, user, prop) => {
  const key = user === 'player' ? 'players' : 'enemies'

  switch (prop) {
    case 'name':
      return Object.keys(gameData[key])

    case 'items':
      const items = Object.keys(gameData.items)
      return filterItems(items, state.input[user].items);

    case 'traits':
      const traits = [];
      _.each(gameData.traits, (trait, name) => {
        if (trait.for == user) traits.push(name);
      });
      const name = state.input[user].name;
      if (gameData[key][name]) {
        traits.push(...gameData[key][name].situationalTraits || [])
      }
      return filterTraits(traits, state.input[user].traits);
  }
}

const mapStateToProps = (state, ownProps) => {
  const value = state.input[ownProps.user][ownProps.prop]
  const source = getSource(state, ownProps.user, ownProps.prop)
  const multiple = ['traits', 'items'].includes(ownProps.prop)
  return {
    value,
    source,
    multiple,
    label: ownProps.label,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onChange: (value) => (
    dispatch(updateInput(ownProps.user, ownProps.prop, value))
  )
})

const SolverInput = connect(mapStateToProps, mapDispatchToProps)(Input)

SolverInput.propTypes = {
  label: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  prop: PropTypes.string.isRequired,
}

export default SolverInput
