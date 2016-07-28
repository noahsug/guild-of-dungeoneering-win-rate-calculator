import gs from './game-state'
import Card from './card'
import gameData from './game-data'
import _ from '../../utils'

class GameStateFactory {
  create(heroDesc, enemyDesc) {
    const hero = this.createInitialState_(heroDesc, gameData.heroes)
    const enemy = this.createInitialState_(enemyDesc, gameData.enemies)
    return gs.create(hero, enemy)
  }

  createInitialState_(desc, heroList) {
    desc = _.defaults(desc, { items: [], traits: [], sets: [] })
    const hero = heroList[desc.name]
    _.assert(hero, `invalid name: ${desc.name}`)
    let sets = hero.sets.concat(desc.sets)
    const traits = (hero.traits || []).concat(desc.traits)

    desc.items.forEach((i) => {
      const item = gameData.items[i]
      sets.push(...(item.sets || []))
      traits.push(...(item.traits || []))
    })

    const state = { health: hero.health }
    const traitSets = this.resolveSituationalTraits_(state, traits)
    this.resolveHealthTraits_(state, traits)
    sets = sets.concat(traitSets)
    Object.assign(state, this.getTraits_(traits))
    state.deck = this.getDeck_(sets)
    _.increment(state, 'handSize', gs.STARTING_HAND_SIZE)
    return state
  }

  resolveSituationalTraits_(state, traits) {
    const setNames = ['fire', 'armour', 'blade', 'crush', 'holy', 'arcane',
                      'growth', 'swift', 'stupidity']
    const traitNames = ['physicalNextEffect', 'handSize', 'health', 'tenacious',
                         'punchDrunk', 'burn']
    const sets = []
    traits.forEach((trait) => {
      const desc = gameData.traits[trait]
      if (!desc) return
      traitNames.forEach(traitName => {
        _.increment(state, traitName, desc[traitName] || 0)
      })
      setNames.forEach(set => {
        if (desc[set]) sets.push(`${_.s.capitalize(set)} ${desc[set]}`)
      })
    })
    return sets
  }

  // Handle +1HP, -2HP, etc traits
  resolveHealthTraits_(state, traits) {
    traits.forEach((trait) => {
      const match = trait.match(/([+-]\d)+HP/)
      if (!match) return
      state.health += parseInt(match[1])
    })
  }

  getTraits_(traitList) {
    const traits = {}
    traitList.forEach((trait) => {
      const traitName = _.s.decapitalize(trait.replace(/\s/g, ''))
      _.increment(traits, traitName)
    })
    return traits
  }

  getDeck_(sets) {
    sets = this.addSetNumbers_(sets)
    let deck = []
    sets.forEach(set => {
      deck = deck.concat(Card.getSet(set))
    })
    return deck
  }

  addSetNumbers_(sets) {
    const setNumbers = {}
    sets.forEach((set) => {
      const num = Number(_.last(set))
      if (!num) {
        setNumbers[set] = 0
      } else {
        _.increment(setNumbers, set.slice(0, -2), num)
      }
    })
    const mergedSets = []
    _.each(setNumbers, (num, set) => {
      if (!num) {
        mergedSets.push(set)
      } else {
        let name = `${set} ${num}`
        while (!gameData.sets[name]) {
          num--
          name = `${set} ${num}`
          _.assert(num)
        }
        mergedSets.push(name)
      }
    })
    return mergedSets
  }
}

export default new GameStateFactory()
