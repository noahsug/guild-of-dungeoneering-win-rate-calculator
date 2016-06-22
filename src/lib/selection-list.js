import _ from '../utils'
import { gameData } from './game-engine'

function convertCards(cards) {
  if (!_.isArray(cards)) cards = [cards]
  cards = cards.map(c => gameData.cards[c].desc)
  cards.sort()
  return cards
}

class HeroHandSelectionList {
  constructor(solver) {
    this.solver_ = solver
  }

  getSelection(handDesc) {
    return this.solver_.state.children.find((s) => {
      const hand = convertCards(s.hero.hand)
      return _.isSortedEqual(handDesc, hand)
    })
  }

  get type() { return 'HERO_HAND' }

  getResult() {
    return this.solver_.getResult()
  }

  getSelections() {
    const selections = this.solver_.state.children.map((s) => ({
      result: this.solver_.getResult(s),
      cards: convertCards(s.hero.hand),
    }))
    return _.sortBy(selections, (s) => s.cards.join(' '))
  }
}

class EnemyCardSelectionList {
  constructor(solver) {
    this.solver_ = solver
  }

  getSelection(enemyCardDesc) {
    return gameData.cardDescs[enemyCardDesc]
  }

  get type() { return 'ENEMY_CARD' }

  getResult(state) {
    return this.solver_.getResult(state)
  }

  getSelections(state) {
    const selections = _.uniq(this.solver_.enemyDeck).map(enemyCard => ({
      result: this.solver_.getResult(state, enemyCard),
      cards: convertCards(enemyCard),
    }))
    return _.sortBy(selections, (s) => s.cards.join(' '))
  }
}

class HeroCardSelectionList {
  constructor(solver) {
    this.solver_ = solver
  }

  getSelection(heroCardDesc) {
    return gameData.cardDescs[heroCardDesc]
  }

  get type() { return 'HERO_CARD' }

  getResult(enemyCard, state) {
    return this.solver_.getResult(state, enemyCard)
  }

  getSelections(enemyCard, state) {
    const selections = _.uniq(state.hero.hand).map(heroCard => ({
      result: this.solver_.getResult(state, enemyCard, heroCard),
      cards: convertCards(heroCard),
    }))
    return _.sortBy(selections, (s) => -s.result)
  }
}

export default class SelectionList {
  constructor(solver) {
    this.selectionLists_ = [
      new HeroHandSelectionList(solver),
      new EnemyCardSelectionList(solver),
      new HeroCardSelectionList(solver),
    ]
    this.selected = []
    this.index_ = 0
  }

  get selectionList_() {
    return this.selectionLists_[this.index_ % this.selectionLists_.length]
  }

  play(selectionDesc) {
    const selection = this.selectionList_.getSelection(selectionDesc)
    this.selected.push(selection)
    this.index_++
  }

  back() {
    this.selected.pop()
    this.index_--
  }

  get type() { return this.selectionList_.type }

  get result() {
    return this.selectionList_.getResult(...this.lastTwoSelections_)
  }

  get selections() {
    return this.selectionList_.getSelections(...this.lastTwoSelections_)
  }

  get lastTwoSelections_() {
    const len = this.selected.length
    return [this.selected[len - 1], this.selected[len - 2]]
  }
}
