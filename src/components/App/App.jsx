import React from 'react'
import classNames from 'classnames/bind'
import style from './App.scss'
import AppHeader from '../AppHeader'
import AppFooter from '../AppFooter'
import InputCard from '../InputCard'
import BreakdownCard from '../BreakdownCard'

const cx = classNames.bind(style)

function onKeyDown(e) {
  console.log('KEYDOWN!', e.code)
}

const App = () => (
  <div>
    <AppHeader />
    <div className={cx('card-content')}>
      <div className={cx('card-column')}>
        <InputCard />
      </div>
      <div className={cx('card-column')}>
        <BreakdownCard />
      </div>
    </div>
    <AppFooter />
  </div>
)

export default App
