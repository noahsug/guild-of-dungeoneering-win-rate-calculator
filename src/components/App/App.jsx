import React from 'react'
import classNames from 'classnames/bind'
import style from './App.scss'
import AppHeader from '../AppHeader'
import AppFooter from '../AppFooter'
import InputCard from '../InputCard'
import BreakdownCard from '../BreakdownCard'

const cx = classNames.bind(style)

const App = () => (
  <div>
    <AppHeader />
    <div className={cx('cards')}>
      <InputCard />
      <BreakdownCard />
    </div>
    <AppFooter />
  </div>
)

export default App
