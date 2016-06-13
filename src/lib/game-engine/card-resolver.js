import PlayerCardResolver from './player-card-resolver'
import Card from './card'

export default class CardResolver {
  constructor() {
    this.hero_ = new PlayerCardResolver(true /* is hero */)
    this.enemy_ = new PlayerCardResolver(false /* is hero */)
    this.hero_.enemy = this.enemy_
    this.enemy_.enemy = this.hero_
  }

  // Used to keep track of starting HP and persistant traits.
  set initState(initialState) {
    this.hero_.initial = initialState.hero
    this.enemy_.initial = initialState.enemy
  }

  resolve(state, heroCardId, enemyCardId) {
    this.hero_.init(state.hero, Card.list[heroCardId])
    this.enemy_.init(state.enemy, Card.list[enemyCardId])

    this.hero_.resolveBurnDmg()
    this.enemy_.resolveBurnDmg()
    if (this.hero_.dead) return 0
    if (this.enemy_.dead) return 1

    if (this.hero_.quick && !this.enemy_.quick &&
        !this.enemy_.survivedQuick()) {
      return !this.hero_.dead
    }
    if (this.enemy_.quick && !this.hero_.quick &&
        !this.hero_.survivedQuick()) {
      return !this.hero_.dead
    }
    this.resolveCombat_()

    if (this.hero_.dead) return 0
    if (this.enemy_.dead) return 1
    return undefined
  }

  resolveCombat_() {
    this.hero_.setDmgAndBlock()
    this.enemy_.setDmgAndBlock()

    this.hero_.prepareToTakeCombatDmg()
    this.enemy_.prepareToTakeCombatDmg()

    this.hero_.processDmgTaken()
    this.enemy_.processDmgTaken()

    this.hero_.postProcessDmgTaken()
    this.enemy_.postProcessDmgTaken()

    this.enemy_.processDmgDelt()
    this.hero_.processDmgDelt()

    this.enemy_.resolveCombatDmg()
    this.hero_.resolveCombatDmg()
  }
}
