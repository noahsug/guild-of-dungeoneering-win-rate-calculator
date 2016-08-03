import React from 'react'
import { Card, CardTitle, CardText } from 'react-toolbox/lib/card'
import classNames from 'classnames/bind'
import style from './InstructionCard.scss'
import cardTitleTheme from '../themes/card-title-theme.scss'

const cx = classNames.bind(style)

const InstructionCard = () => (
  <Card className={cx('content')}>
    <CardTitle
      theme={cardTitleTheme}
      title="Instructions"
    />
    <CardText>
      <ol>
        <li>Select your <strong>dungeoneer</strong></li>
        <li>
          Input <strong>items, trinkets, level and battle scars</strong>
        </li>
        <li>Choose which <strong>enemy</strong> you're up against</li>
        <li>
          Press the <strong><span>CALCULATE WIN RATE</span></strong> button
          (<i>Shift Enter</i>), accuracy increases over time
        </li>
        <li>
          [Optional] Select your starting hand and enemy card to view
          the best card to play next
        </li>
      </ol>
    </CardText>
    <CardText className={cx('footer')}>
      <div>
        Note: Mime, Mathemagician, Artificer, predictable, conceal, enemy
        discard steal, and fountain effects have not been added yet.
    </div>
    </CardText>
  </Card>
)

export default InstructionCard
