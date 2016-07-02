import React from 'react'
import { Card, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import BreakdownHeader from './BreakdownHeader'
import BackButton from './BackButton'
import SelectionListContainer from '../containers/SelectionListContainer'

const BreakdownCard = () => (
  <Card>
    <BreakdownHeader />
    <SelectionListContainer />
    <CardActions>
      <BackButton />
    </CardActions>
  </Card>
)

export default BreakdownCard
