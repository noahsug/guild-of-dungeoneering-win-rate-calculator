import React from 'react';
import SolveButton from './SolveButton';
import SolverInput from '../containers/SolverInput';

const InputCard = () => (
  <div>
    <SolverInput
      label="Dungeoneer"
      user="player"
      prop="name"
    />
    <SolverInput
      label="Items"
      user="player"
      prop="items"
    />
    <SolverInput
      label="Trinket, Level, Battle Scars"
      user="player"
      prop="traits"
    />
    <SolverInput
      label="Enemy"
      user="enemy"
      prop="name"
    />
    <SolverInput
      label="Enemy Traits"
      user="enemy"
      prop="traits"
    />
    <SolveButton />
  </div>
);

export default InputCard;
