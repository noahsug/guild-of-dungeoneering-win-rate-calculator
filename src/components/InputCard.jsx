import React from 'react'
import SolveButton from './SolveButton'
import SolverInput from '../containers/SolverInput'

const InputCard = () => (
  <div>
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
    <SolveButton />
  </div>
)

export default InputCard
