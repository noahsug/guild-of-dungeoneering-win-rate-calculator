import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { CardTitle } from 'react-toolbox/lib/card';

const mapStateToProps = (state) => ({
  result: state.solver.result,
  hero: {
    name: state.input.hero.name,
    health: state.solver.heroHealth,
  },
  enemy: {
    name: state.input.enemy.name,
    health: state.solver.enemyHealth,
  },
})

const formatResult = (result) => (
  `${result * 100 | 0}% chance to win`
)

const formatStats = (hero, enemy) => (
  `${hero.name} ${hero.health}hp vs ${enemy.name} ${enemy.health}hp`
)

const WinRate = ({ result, hero, enemy }) => {
  if (result === undefined) return <div />
  return (
    <CardTitle
      title={formatResult(result)}
      subtitle={formatStats(hero, enemy)}
    />
  )
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
  }).isRequired
}

export default connect(mapStateToProps)(WinRate)
