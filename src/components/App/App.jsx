import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames/bind'
import style from './App.scss'
import AppHeader from '../AppHeader'
import AppFooter from '../AppFooter'
import InputCard from '../InputCard'
import BreakdownCard from '../BreakdownCard'
import InstructionCard from '../InstructionCard'

const cx = classNames.bind(style)

const mapStateToProps = (state) => ({
  showBreakdown: state.breakdown.result !== undefined
})

const App = ({ showBreakdown }) => (
  <div>
    <AppHeader />
    <div className={cx('cards')}>
      <InputCard />
      {showBreakdown ? <BreakdownCard /> : <InstructionCard />}
    </div>
    <AppFooter />
  </div>
)

App.propTypes = {
  showBreakdown: PropTypes.bool.isRequired,
}

export default connect(mapStateToProps)(App)
