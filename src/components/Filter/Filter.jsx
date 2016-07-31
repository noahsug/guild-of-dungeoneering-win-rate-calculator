import React, { PropTypes } from 'react'
import { Input } from 'react-toolbox/lib/input'

const Filter = ({ filter, setFilter }) => (
  <Input
    type="text"
    label="Filter cards"
    value={filter}
    onChange={setFilter}
  />
)

Filter.propTypes = {
  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
}

export default Filter
