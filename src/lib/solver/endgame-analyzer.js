import _ from '../../utils'
import { gs, CardResolver } from '../game-engine'
import { gameData } from '../game-engine'

export default class EndgameAnalyzer {
  constructor() {
    this.resolver_ = new CardResolver()

    this.highestHealthWin_ = 0
    this.lowestHealthLoss_ = Infinity

    // Whether the hero can always win with a full hand.
    this.willWinWithFullHand_ = undefined
  }

  maybeGetResult(state) {
    let enemyHealth = state.enemy.health
    if (state.enemy.rum) enemyHealth += 2
    //const healthDiff = state.hero.health - enemyHealth

    //if (enemyHealth >= this.lowestHealthLoss_) return undefined
    //if (enemyHealth <= this.highestHealthWin_) return 1

    const result = this.checkFullHandWin_(state, enemyHealth)
    //if (result) {
    //  this.highestHealthWin_ = enemyHealth
    //} else {
    //  this.lowestHealthLoss_ = enemyHealth
    //}

    return result
  }

  checkFullHandWin_(state, enemyHealth) {
    if (!this.analyzed_) this.analyze_()

    // If hero is burning, don't make promise a win.
    if (state.hero.physicalRoundEffect || state.hero.magicRoundEffect) {
      return undefined
    }
    // If hero can't take peak damage, don't promise a win.
    if (state.hero.health <= this.efficiency_.peak) {
      return undefined
    }

    if (this.willWinWithFullHand_) return 1

    // Check if hero can kill enemy before they die.
    let rounds = state.hero.health / this.efficiency_.taken - 1
    if (this.initState_.enemy.tenacious) rounds--
    if (rounds * this.efficiency_.given >= enemyHealth) return 1
    return undefined
  }

  set initState(initState) {
    this.initState_ = _.deepClone(initState)
    this.initState_.enemy.health = 100
    this.initState_.hero.health = 100
    this.resolver_.initState = this.initState_

    this.state_ = gs.clone(this.initState_)
    // Enable fury
    this.state_.enemy.health = 49
    // Draw entire hand
    this.state_.hero.hand = this.state_.hero.deck
    this.state_.hero.deck = []
    this.state_.enemy.deck = initState.enemy.deck.slice()

    this.efficiency_ = { given: 0, taken: 0, peak: 0 }
    this.dmg_ = { given: 0 }
    this.burst_ = { given: -Infinity, taken: Infinity }
    this.analyzed_ = false
  }

  analyze_() {
    this.state_.enemy.deck.forEach((enemyCard, i) => {
      const best = {
        efficiency: { given: -Infinity, taken: Infinity },
        dmg: { given: -Infinity },
      }

      this.state_.hero.hand.forEach(heroCard => {
        // FIXME
        //console.log(gameData.cards[heroCard].desc, 'vs',
        //            gameData.cards[enemyCard].desc)
        const quick = gameData.cards[heroCard].quick
        const state = gs.clone(this.state_)
        this.resolver_.resolve(state, heroCard, enemyCard)
        this.updateBest_(best, state, quick)
      })
      //console.log(best.efficiency)

      this.efficiency_.given += best.efficiency.given
      this.efficiency_.taken += best.efficiency.taken
      if (this.efficiency_.taken > 0) {
        this.efficiency_.peak += best.efficiency.taken * 2
      }
      this.dmg_.given += best.dmg.given
    })

    this.analyzed_ = true
    // FIXME
    console.log('EFFICIENCY:', this.efficiency_, this.dmg_)

    if (this.initState_.hero.burn || this.initState_.enemy.burn) return
    if (this.efficiency_.taken >= this.efficiency_.given) return
    // Check if we can take no damage while giving damage
    if (this.efficiency_.taken <= 0 &&
        this.efficiency_.taken < this.efficiency_.given &&
        this.dmg_.given > 0) {
      this.willWinWithFullHand_ = true
    }
  }

  updateBest_(best, state, quick) {
    if (state.hero.discardEffect > state.hero.drawEffect) return

    const taken = this.dmgGivenTo_(state, 'hero')
    const given = this.dmgGivenTo_(state, 'enemy')
    const burstTaken = quick ? 0 : taken

    if (given === this.burst_.given) {
      if (burstTaken < this.burst_.taken) this.burst_.taken = burstTaken
    } else if (given > this.burst_.given) {
      this.burst_.given = given
      this.burst_.taken = quick ? 0 : taken
    }

    let efficiency = given - taken * 3
    let bestEfficiency = best.efficiency.given - best.efficiency.taken * 3
    if (efficiency > bestEfficiency) {
      best.efficiency.given = given
      best.efficiency.taken = taken
    }

    if (given > best.dmg.given) {
      best.dmg.given = given
    }
  }

  dmgGivenTo_(nextState, player) {
    const enemy = player === 'hero' ? 'enemy' : 'hero'
    let dmg = this.state_[player].health - nextState[player].health
    dmg += nextState[enemy].physicalNextEffect -
        this.state_[enemy].physicalNextEffect
    dmg += nextState[enemy].magicNextEffect -
        this.state_[enemy].magicNextEffect
    return dmg
  }
}
