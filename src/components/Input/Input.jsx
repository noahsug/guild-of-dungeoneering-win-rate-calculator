import React, { PropTypes } from 'react'
import Autocomplete from 'react-toolbox/lib/autocomplete'
import _ from '../../utils'

const Input = ({ label, source, multiple, value, onChange }) => {
  if (source.length === 0) {
    return <div />
  }

  const inputStyle = {
    'has-value': _.isArray(value) ? value.length > 0 : value,
    multiple,
  }

  return (
    <Autocomplete
      label={label}
      source={source}
      multiple={multiple}
      value={value}
      onChange={onChange}
      showSuggestionsWhenValueIsSet={true}
      suggestionMatch="anywhere"
    />
  )
}

Input.propTypes = {
  label: PropTypes.string.isRequired,
  source: PropTypes.arrayOf(PropTypes.string).isRequired,
  multiple: PropTypes.bool.isRequired,
  value: React.PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default Input
