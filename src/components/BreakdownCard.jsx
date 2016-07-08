import React from 'react'
import { Card } from 'react-toolbox/lib/card'
import BreakdownHeader from './BreakdownHeader'
import BackButton from './BackButton'
import SelectionListContainer from '../containers/SelectionListContainer'
import AttrDescriptionsButton from './AttrDescriptionsButton'

const BreakdownCard = () => (
  <Card>
    <BreakdownHeader />
    <SelectionListContainer />
    <BackButton />
    <AttrDescriptionsButton />
  </Card>
)

export default BreakdownCard
