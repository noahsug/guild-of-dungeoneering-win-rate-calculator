import _ from '../../utils'

class GameState {
  STARTING_HAND_SIZE = 3

  create(hero = {}, enemy = {}) {
    return {
      hero: this.createPlayerState(hero),
      enemy: this.createPlayerState(enemy),
    }
  }

  createPlayerState(player = {}) {
    return _.defaults(player, {
      health: 5,
      deck: [],
      hand: [],
      discard: [],

      handSize: this.STARTING_HAND_SIZE,
      blessing: 0,
      frail: 0,
      mundane: 0,
      fury: 0,
      predictable: 0,
      brittle: 0,
      tenacious: 0,
      sluggish: 0,
      bulwark: 0,
      retribution: 0,
      decay: 0,
      tough: 0,
      spikey: 0,
      ferocious: 0,
      burn: 0,
      respite: 0,
      ranged: 0,
      rulesLawyer: 0,
      spellsword: 0,
      showoff: 0,
      punchDrunk: 0,
      rum: 0,

      magicNextEffect: 0,
      physicalNextEffect: 0,
      magicRoundEffect: 0,
      physicalRoundEffect: 0,
      withstandEffect: 0,

      stealEffect: 0,
      discardEffect: 0,
      drawEffect: 0,
      cycleEffect: 0,
    })
  }


  clone(state) {
    return {
      hero: {
        health: state.hero.health,
        deck: state.hero.deck.slice(),
        hand: state.hero.hand.slice(),
        discard: state.hero.discard.slice(),

        magicNextEffect: state.hero.magicNextEffect,
        physicalNextEffect: state.hero.physicalNextEffect,
        magicRoundEffect: state.hero.magicRoundEffect,
        physicalRoundEffect: state.hero.physicalRoundEffect,
        withstandEffect: state.hero.withstandEffect,

        stealEffect: 0,
        discardEffect: 0,
        drawEffect: 0,
        cycleEffect: 0,
      },
      enemy: {
        health: state.enemy.health,

        magicNextEffect: state.enemy.magicNextEffect,
        physicalNextEffect: state.enemy.physicalNextEffect,
        magicRoundEffect: state.enemy.magicRoundEffect,
        physicalRoundEffect: state.enemy.physicalRoundEffect,
        withstandEffect: state.hero.withstandEffect,
        rum: state.enemy.rum,

        stealEffect: 0,
        discardEffect: 0,
        drawEffect: 0,
      },
    }
  }

  // Same as clone, but copies draw / discard / etc effects.
  incrementalClone(state) {
    return {
      hero: {
        health: state.hero.health,
        deck: state.hero.deck.slice(),
        hand: state.hero.hand.slice(),
        discard: state.hero.discard.slice(),

        magicNextEffect: state.hero.magicNextEffect,
        physicalNextEffect: state.hero.physicalNextEffect,
        magicRoundEffect: state.hero.magicRoundEffect,
        physicalRoundEffect: state.hero.physicalRoundEffect,
        withstandEffect: state.hero.withstandEffect,

        stealEffect: state.hero.stealEffect,
        discardEffect: state.hero.discardEffect,
        drawEffect: state.hero.drawEffect,
        cycleEffect: state.hero.cycleEffect,
      },
      enemy: {
        health: state.enemy.health,

        magicNextEffect: state.enemy.magicNextEffect,
        physicalNextEffect: state.enemy.physicalNextEffect,
        magicRoundEffect: state.enemy.magicRoundEffect,
        physicalRoundEffect: state.enemy.physicalRoundEffect,
        withstandEffect: state.hero.withstandEffect,
        rum: state.enemy.rum,

        stealEffect: 0,
        discardEffect: 0,
        drawEffect: 0,
      },
    }
  }

  // Same as clone but w/o copying deck, hand, discard info.
  cloneStats(state) {
    return {
      hero: {
        health: state.hero.health,

        magicNextEffect: state.hero.magicNextEffect,
        physicalNextEffect: state.hero.physicalNextEffect,
        magicRoundEffect: state.hero.magicRoundEffect,
        physicalRoundEffect: state.hero.physicalRoundEffect,
        withstandEffect: state.hero.withstandEffect,
      },
      enemy: {
        health: state.enemy.health,

        magicNextEffect: state.enemy.magicNextEffect,
        physicalNextEffect: state.enemy.physicalNextEffect,
        magicRoundEffect: state.enemy.magicRoundEffect,
        physicalRoundEffect: state.enemy.physicalRoundEffect,
        withstandEffect: state.hero.withstandEffect,
        rum: state.enemy.rum,
      },
    }
  }

  result(state) {
    return (state.hero.health <= 0) * -1 || (state.enemy.health <= 0) * 1
  }

  cards(hero) {
    return hero.hand.concat(hero.deck).concat(hero.discard)
  }

  drawIndex(hero, index) {
    hero.hand.push(hero.deck[index])
    return hero.deck.splice(index, 1)[0]
  }

  discardIndex(hero, index) {
    hero.discard.push(hero.hand.splice(index, 1)[0])
  }

  prepDraw(hero) {
    if (hero.deck.length === 0) {
      const temp = hero.deck
      hero.deck = hero.discard
      hero.discard = temp
    }
  }

  drawOne(hero, indexValue) {
    if (!hero.deck.length) {
      hero.deck = hero.discard
      hero.discard = []
    }
    const index = hero.deck.length * indexValue | 0
    hero.hand.push(hero.deck.splice(index, 1)[0])
  }

  draw(hero, indexValue, count) {
    if (!hero.deck.length) {
      if (!hero.discard.length) return
      hero.deck = hero.discard
      hero.discard = []
    }
    if (this.moveCards_(hero.deck, hero.hand, indexValue, count)) {
      hero.deck = []
    }
  }

  discard(hero, indexValue, count) {
    if (this.moveCards_(hero.hand, hero.discard, indexValue, count)) {
      hero.hand = []
    }
  }

  // Returns true if all cards were moved and the source should be cleared.
  moveCards_(from, to, indexValue, count) {
    const fromLen = from.length
    if (fromLen <= count) {
      to.push(...from)
      return true
    }

    let index = fromLen * indexValue | 0
    const endIndex = index + count
    if (endIndex >= fromLen) {
      const overflow = endIndex - fromLen
      to.push(...from.splice(0, overflow))
      count -= overflow
      index -= overflow
    }
    to.push(...from.splice(index, count))
    return false
  }
}

export default new GameState()
