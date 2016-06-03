import gs from './game-state'
import gsFactory from './game-state-factory'
import gameData from './game-data'
import CardResolver from './card-resolver'
import CardMover from './card-mover'
import Card from './card'

gameData.cards = Card.list

export default {
  gs,
  gsFactory,
  gameData,
  CardResolver,
  CardMover,
}
