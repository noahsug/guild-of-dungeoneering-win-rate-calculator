import _ from '../../utils'
import { gameData } from '../../lib'

function filterSelections(selections, filter) {
  if (!filter) return selections
  filter = filter.toUpperCase().
    replace(/\/(?![A-Z])/g, ' ').  // Remove trailing slash
    replace(/\s+/g, ' ').  // Remove extra whitespace
    trim()

  console.log(filter)

  const filterCards = filter.split(' ')
  return selections.filter(s => satisfiesFilter(s, filter))

  function satisfiesFilter(selection, filter) {
    const matchLists = filterCards.map(filterCard => {
      let filterAttrs = filterCard.split(gameData.CARD_DELIMITER)
      return getCardMatches(selection.cards, filterAttrs);
    })
    return eachFilterCardHasUniqueMatch(matchLists)
  }

  // Returns an array of bools that correspond to the card at the same index.
  function getCardMatches(cards, filterAttrs) {
    return cards.map(card => {
      const attrs = card.split(gameData.CARD_DELIMITER)
      const leftOver = _.removeAll(attrs, filterAttrs)
      return leftOver.length + filterAttrs.length === attrs.length
    })
  }

  function eachFilterCardHasUniqueMatch(matchLists, index = 0, visited = []) {
    if (index === matchLists.length) return true
    return matchLists[index].some((isMatch, i) => {
      if (!isMatch || visited[i]) return false
      visited[i] = true
      const result = eachFilterCardHasUniqueMatch(
          matchLists, index + 1, visited)
      visited[i] = false
      return result
    })
  }
}

export {
  filterSelections
}
