import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { CardTitle } from 'react-toolbox/lib/card'
import cardTitleTheme from '../themes/card-title-theme.scss'

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

const formatStats = (result, hero, enemy) => (
  `${hero.name} ${hero.health}hp vs ${enemy.name} ${enemy.health}hp`
)

const WinRate = ({ result, hero, enemy }) => (
  <div>
    <CardTitle
      theme={cardTitleTheme}
      title={`${result * 100 | 0}% chance to win`}
      subtitle={formatStats(result, hero, enemy)}
    />
  </div>
)

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
