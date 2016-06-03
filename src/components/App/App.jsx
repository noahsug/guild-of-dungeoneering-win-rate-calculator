import React from 'react';
import style from './App.scss'
import SolveButton from '../SolveButton';
import WinRate from '../WinRate';
import SolverInput from '../../containers/SolverInput';

const App = () => (
  <div className={style.content}>
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
    <WinRate />
  </div>
);

export default App;
