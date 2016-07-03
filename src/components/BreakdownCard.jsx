import React from 'react'
import { Card, CardTitle } from 'react-toolbox/lib/card'
import BreakdownHeader from './BreakdownHeader'
import BackButton from './BackButton'
import SelectionListContainer from '../containers/SelectionListContainer'

const BreakdownCard = () => (
  <Card>
    <BreakdownHeader />
    <SelectionListContainer />
    <BackButton />
  </Card>
)

export default BreakdownCard
