import React, { PropTypes } from 'react'
import Autocomplete from 'react-toolbox/lib/autocomplete'

const Input = ({ label, source, multiple, value, onChange }) => (
  <Autocomplete
    label={label}
    source={source}
    multiple={multiple}
    value={value}
    onChange={onChange}
  />
)

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
