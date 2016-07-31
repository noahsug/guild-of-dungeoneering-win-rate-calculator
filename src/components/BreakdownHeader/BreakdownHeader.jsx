import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { CardTitle } from 'react-toolbox/lib/card'
import cardTitleTheme from '../themes/card-title-theme'

const mapStateToProps = (state) => ({
  result: state.breakdown.result,
  hero: {
    name: state.input.hero.name,
    health: state.breakdown.heroHealth,
  },
  enemy: {
    name: state.input.enemy.name,
    health: state.breakdown.enemyHealth,
  },
})

const formatResult = (result) => (
  result === undefined ? 'Win Rate' :
      `${result * 100 | 0}% chance to win`
)

const formatStats = (result, hero, enemy) => {
  if (!hero.name || !enemy.name) return ''
  if (result === undefined) return `${hero.name} vs ${enemy.name}`
  return `${hero.name} ${hero.health}hp vs ${enemy.name} ${enemy.health}hp`
}

const WinRate = ({ result, hero, enemy }) => {
  return (
  <div>
    <CardTitle
      theme={cardTitleTheme}
      title={formatResult(result)}
      subtitle={formatStats(result, hero, enemy)}
    />
  </div>)
}

WinRate.propTypes = {
  result: PropTypes.number,
  hero: PropTypes.shape({
    name: PropTypes.string,
    health: PropTypes.number,
  }).isRequired,
  enemy: PropTypes.shape({
    name: PropTypes.string,
    health: PropTypes.number,
  }).isRequired,
}

export default connect(mapStateToProps)(WinRate)
