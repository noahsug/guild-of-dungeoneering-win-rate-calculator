import React, { PropTypes } from 'react'
import Autocomplete from 'react-toolbox/lib/autocomplete'

const Input = ({ label, source, multiple, value, onChange, disabled }) => {
  if (source.length === 0) return null

  return (
    <Autocomplete
      label={label}
      disabled={disabled}
      source={source}
      multiple={multiple}
      value={value}
      onChange={onChange}
      showSuggestionsWhenValueIsSet
      suggestionMatch="anywhere"
    />
  )
}

Input.propTypes = {
  label: PropTypes.string.isRequired,
  source: PropTypes.arrayOf(PropTypes.string).isRequired,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  value: React.PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default Input
