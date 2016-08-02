import { gameData } from '../game-engine'

export default class Hasher {
  constructor() {
    this.hashes_ = {}
    const numCards = gameData.cards.length
    this.hashes_.heroDeck = this.getHashes_(numCards)
    this.hashes_.heroHand = this.getHashes_(numCards)
    this.hashes_.heroDiscard = this.getHashes_(numCards)
    this.hashes_.playedCard = this.getHashes_(1)[0]
    this.hashes_.enemyCard = this.getHashes_(1)[0]
    this.hashes_.enemyDraws = this.getHashes_(numCards)
    this.hashes_.stats = this.getHashes_(30)

    this.order_ = { enemyDraws: [] }
  }

  getHashes_(len) {
    const hashes = new Uint32Array(len)
    window.crypto.getRandomValues(hashes)
    return hashes
  }

  set order(cardOrder) {
    this.order_ = cardOrder
  }

  hash(state, depth) {
    return this.hashCards_(state.hero.deck, this.hashes_.heroDeck) +
        this.hashCards_(state.hero.hand, this.hashes_.heroHand) +
        this.hashCards_(state.hero.discard, this.hashes_.heroDiscard) +
        this.hashStats_(state) +
        this.hashEnemyDeck_(depth)
  }

  hashCards_(cards, hashes) {
    let result = 0
    const len = cards.length
    for (let i = 0; i < len; i++) {
      result += hashes[cards[i]]
    }
    return result
  }

  hashEnemyDeck_(depth) {
    let result = this.hashes_.enemyCard * this.order_.enemyDraws[depth]
    const len = this.order_.deckEndIndex
    for (let i = depth + 1; i < len; i++) {
      result += this.hashes_.enemyDraws[this.order_.enemyDraws[i]]
    }
    return result
  }

  hashStats_(state) {
    // TODO: Implement conceal and predictable.
    return state.hero.health * this.hashes_.stats[0] +
        state.enemy.health * this.hashes_.stats[1] +
        state.hero.magicNextEffect * this.hashes_.stats[2] +
        state.hero.physicalNextEffect * this.hashes_.stats[3] +
        state.hero.magicRoundEffect * this.hashes_.stats[4] +
        state.hero.physicalRoundEffect * this.hashes_.stats[5] +
        state.hero.withstandEffect * this.hashes_.stats[11] +
        state.enemy.magicNextEffect * this.hashes_.stats[6] +
        state.enemy.physicalNextEffect * this.hashes_.stats[7] +
        state.enemy.magicRoundEffect * this.hashes_.stats[8] +
        state.enemy.physicalRoundEffect * this.hashes_.stats[9] +
        state.enemy.rum * this.hashes_.stats[10]
  }

  hashMove(hash, playedCard) {
    return hash + this.hashes_.playedCard * playedCard
  }
}
