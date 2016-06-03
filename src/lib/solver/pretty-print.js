import { gameData } from '../game-engine'
import _ from '../../utils'

class PrettyPrint {
  card(card) {
    return gameData.cards[card].desc
  }

  cards(cards) {
    return cards.map(this.card)
  }

  depth(depth) {
    return new Array(depth).fill(' ').join('')
  }

  percent(x) {
    return `${_.percent(x)} %`
  }
}

export default new PrettyPrint()
