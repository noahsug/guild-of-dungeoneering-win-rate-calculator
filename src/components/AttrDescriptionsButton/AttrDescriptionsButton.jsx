import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames/bind'
import style from './AttrDescriptionsButton.scss'

const cx = classNames.bind(style)

const AttrDescriptionsButton = () => {
  const attrs = {M: 'Magic damage', P: 'Physical damage'}

  return (
    <div />
  //  {attrs.map((desc, attr) => (
  //    <p key={attr}>
  //      <strong>{attr}</strong>: {desc}
  //    </p>
  //  ))}
  )
}

export default AttrDescriptionsButton
