import React, { PropTypes } from 'react'
import classNames from 'classnames/bind'
import Autocomplete from 'react-toolbox/lib/autocomplete'
import style from './Input.scss'
import _ from '../../utils'

const cx = classNames.bind(style)

const Input = ({ label, source, multiple, value, onChange }) => {
  if (source.length == 0) {
    return <div />
  }

  const inputStyle = {
    'has-value': _.isArray(value) ? value.length > 0 : value,
    multiple,
  }

  return (
    <Autocomplete
      className={cx("input", inputStyle)}
      label={label}
      source={source}
      multiple={multiple}
      value={value}
      onChange={onChange}
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
