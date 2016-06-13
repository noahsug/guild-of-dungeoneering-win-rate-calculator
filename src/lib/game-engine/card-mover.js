import gs from './game-state'
import _ from '../../utils'

export default class CardMover {
  moveCards(state, heroCardIndex, depth) {
    const played = state.hero.hand.splice(heroCardIndex, 1)[0]
    // TODO: Implement steal, enemy discard (card not discarded is played next),
    // and clone.
    if (state.hero.cycleEffect && state.hero.hand.length) {
      const discardValue = this.order.cycleDiscardValues[depth]
      const drawValue = this.order.cycleDrawValues[depth]
      const numCycled = Math.min(
          state.hero.cycleEffect, state.hero.hand.length)
      gs.discard(state.hero, discardValue, numCycled)
      gs.draw(state.hero, drawValue, numCycled)
    }

    if (state.hero.drawEffect) {
      const drawValue = this.order.drawValues[depth]
      gs.draw(state.hero, drawValue, state.hero.drawEffect)
    }

    if (state.hero.discardEffect) {
      const discardValue = this.order.discardValues[depth]
      gs.discard(state.hero, discardValue, state.hero.discardEffect)
    }

    state.hero.discard.push(played)
    gs.drawOne(state.hero, this.order.endTurnDrawValues[depth])
  }

  getStartingStates(state) {
    const numStates = _.choose(state.hero.deck.length, state.hero.handSize)
    const states = new Array(numStates)
    const heroHandGen = _.combinationsGenerator(
        state.hero.deck, state.hero.handSize)
    let i = 0
    for (const heroHand of heroHandGen) {
      const nextState = gs.cloneStats(state)
      nextState.hero.deck = _.removeAll(state.hero.deck, heroHand)
      nextState.hero.hand = heroHand.slice()
      nextState.hero.discard = []
      _.shuffleInPlace(nextState.hero.deck)
      states[i++] = nextState
    }
    return states
  }

  getNextStates(state, heroCard) {
    const heroCardIndex = state.hero.hand.indexOf(heroCard)
    const played = state.hero.hand.splice(heroCardIndex, 1)[0]
    let states = [state]
    if (state.hero.cycleEffect && state.hero.hand.length) {
      const numCycled = Math.min(
          state.hero.cycleEffect, state.hero.hand.length)
      states = this.discard_(states, numCycled)
      states = this.draw_(states, numCycled)
    }

    if (state.hero.drawEffect) {
      states = this.draw_(states, state.hero.drawEffect)
    }

    if (state.hero.discardEffect) {
      states = this.discard_(states, state.hero.discardEffect)
    }

    this.discardPlayedCard_(states, played)
    return this.draw_(states, 1)
  }

  draw_(states, count) {
    const hero = states[0].hero
    const numStates = states.length
    let deckLen = hero.deck.length
    let discardLen = hero.discard.length
    if (!deckLen) {
      if (!discardLen) return states
      for (let i = 0; i < numStates; i++) {
        gs.prepDraw(states[i].hero)
      }
      deckLen = hero.deck.length
      discardLen = 0
    }

    const newStates = []
    for (let i = 0; i < numStates; i++) {
      const state = states[i]
      const gen = _.combinationsGenerator(_.range(deckLen), count)
      for (const draws of gen) {
        const clone = gs.incrementalClone(state)
        newStates.push(clone)
        const drawLen = draws.length
        for (let di = 0; di < drawLen; di++) {
          gs.drawIndex(clone.hero, draws[di] - di)
        }
      }
    }

    if (count > deckLen && discardLen) {
      return this.draw_(newStates, count - deckLen)
    }
    return newStates
  }

  discard_(states, count) {
    const hero = states[0].hero
    const newStates = []
    const numStates = states.length
    for (let i = 0; i < numStates; i++) {
      const state = states[i]
      const gen = _.combinationsGenerator(_.range(hero.hand.length), count)
      for (const discards of gen) {
        const clone = gs.incrementalClone(state)
        newStates.push(clone)
        const discardLen = discards.length
        for (let di = 0; di < discardLen; di++) {
          gs.discardIndex(clone.hero, discards[di] - di)
        }
      }
    }
    return newStates
  }

  discardPlayedCard_(states, card) {
    const numStates = states.length
    for (let i = 0; i < numStates; i++) {
      states[i].hero.discard.push(card)
    }
  }
}
