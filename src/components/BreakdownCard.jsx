import React from 'react'
import { Card } from 'react-toolbox/lib/card'
import BreakdownHeader from './BreakdownHeader'
import BackButton from './BackButton'
import SelectionListContainer from '../containers/SelectionListContainer'
import AttrDescriptions from './AttrDescriptions'

const BreakdownCard = () => (
  <Card>
    <BreakdownHeader />
    <SelectionListContainer />
    <BackButton />
    <AttrDescriptions />
  </Card>
)

export default BreakdownCard
