import React from 'react'
import classNames from 'classnames/bind'
import style from './AppHeader.scss'

const cx = classNames.bind(style)

const AppHeader = () => (
  <div className={cx('content')}>
    <div>Guild of Dungeoneering</div>
    <div>Win Rate Calculator</div>
  </div>
)

export default AppHeader
