import React from 'react'
import WinRate from './WinRate'
import BackButton from './BackButton'
import SelectionListContainer from '../containers/SelectionListContainer'

const BreakdownCard = () => (
  <div>
    <WinRate />
    <SelectionListContainer />
    <BackButton />
  </div>
)

export default BreakdownCard
