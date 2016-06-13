import React from 'react';
import style from './App.scss'
import InputCard from '../InputCard';
import BreakdownCard from '../BreakdownCard';

const App = () => (
  <div className={style.content}>
    <InputCard />
    <BreakdownCard />
  </div>
);

export default App;
