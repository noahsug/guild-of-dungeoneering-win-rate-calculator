import _ from '../../utils'
import { gameData } from '../../lib'

function filterSelections(selections, filter) {
  if (!filter) return selections
  filter = filter.toLowerCase().
    replace(/\/(?![a-z])/g, ' ').  // Remove trailing slash
    replace(/\s+/g, ' ').  // Remove extra whitespace
    trim()

  const filterCards = filter.split(' ')
  const result = selections.filter(satisfiesFilter)
  if (result.length) return result;

  // Fall back to basic text matching.
  return selections.filter(s => {
    const cardText = s.cards.join(' ').toLowerCase()
    return _.unorderedContains(cardText, filter)
  })

  function satisfiesFilter(selection) {
    const matchLists = filterCards.map(filterCard => {
      const filterAttrs = filterCard.split(gameData.CARD_DELIMITER)
      return getCardMatches(selection.cards, filterAttrs)
    })
    return eachFilterCardHasUniqueMatch(matchLists)
  }

  // Returns an array of bools that correspond to the card at the same index.
  function getCardMatches(cards, filterAttrs) {
    return cards.map(card => {
      const attrs = card.toLowerCase().split(gameData.CARD_DELIMITER)
      return isAttrSubset(filterAttrs, attrs)
    })
  }

  function isAttrSubset(filterAttrs, attrs) {
    const attrMatches = new Array(attrs.length)
    const filterAttrCounts = _.duplicateCounts(filterAttrs)
    // Find exact attr matches.
    attrs.forEach((a, i) => {
      if (filterAttrCounts[a]) {
        attrMatches[i] = true
        filterAttrCounts[a]--
        if (!filterAttrCounts[a]) delete filterAttrCounts[a]
      }
    })

    // Find partial attr matches, e.g. 's' in 'cs'.
    const uniqueFilterAttrs = Object.keys(filterAttrCounts)
    attrs.forEach((a, i) => {
      if (attrMatches[i]) return
      const match = uniqueFilterAttrs.find((fa => {
        if (!filterAttrCounts[fa]) return false
        return a.includes(fa)
      }))
      if (match) {
        filterAttrCounts[match]--
        if (!filterAttrCounts[match]) delete filterAttrCounts[match]
      }
    })

    return _.isEmpty(filterAttrCounts)
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
  filterSelections,
}
