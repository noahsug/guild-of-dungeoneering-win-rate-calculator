import gameData from './game-data.js'
import _ from '../../utils'

const DELIMITER = '/'
let cardIndexesInSets = {}

const sortDesc = (desc) => (
  desc.split(DELIMITER).sort().join(DELIMITER)
)

export default class Card {
  constructor(desc) {
    this.desc = desc
    const attrs = desc.split(DELIMITER)
    this.validateAttrs_(attrs)

    const groups = _.groupBy(attrs)
    _.each(gameData.CARD_ATTRS, (name, shortcut) => {
      this[name] = (groups[shortcut] || []).length
    })
  }

  validateAttrs_(attrs) {
    attrs.forEach(a => {
      _.assert(gameData.CARD_ATTRS[a],
               `Bad card attr: ${a} in ${this.desc}`)
    })
  }

  static list = [0];

  static descToIndex = {};

  static getSet(set) {
    const indexes = cardIndexesInSets[set]
    _.assert(indexes, `Missing set ${set}`)
    return indexes
  }

  static get(desc) {
    return Card.descToIndex[desc]
  }

  static create(desc) {
    desc = sortDesc(desc)
    if (Card.descToIndex[desc] !== undefined) return Card.descToIndex[desc]
    const index = Card.list.length
    Card.list.push(new Card(desc))
    Card.descToIndex[desc] = index
    return index
  }

  static DELIMITER = DELIMITER
}

cardIndexesInSets = _.mapObject(gameData.sets, (set) => (
  _.map(set, (desc) => Card.create(desc))
))
