import React from 'react'
import { Card, CardText, CardActions } from 'react-toolbox/lib/card'
import ProgressBar from './ProgressBar'
import SolveButton from './SolveButton'
import SolverInput from '../containers/SolverInput'

const InputCard = () => (
  <Card>
    <CardText>
      <SolverInput
        label="Dungeoneer"
        player="hero"
        prop="name"
      />
      <SolverInput
        label="Items"
        player="hero"
        prop="items"
      />
      <SolverInput
        label="Trinket, Level, Battle Scars"
        player="hero"
        prop="traits"
      />
      <SolverInput
        label="Enemy"
        player="enemy"
        prop="name"
      />
      <SolverInput
        label="Enemy Traits"
        player="enemy"
        prop="traits"
      />
    </CardText>
    <CardActions>
      <SolveButton />
    </CardActions>
    <ProgressBar />
  </Card>
)

export default InputCard
