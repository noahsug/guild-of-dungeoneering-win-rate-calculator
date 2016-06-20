import _ from '../../utils'

class StateIterator {
  initState(state, children) {
    state.iterations = 0
    state.iterableChildren = []
    this.state_ = state
    this.children_ = children
    this.processChildren_()
  }

  processChildren_() {
    const uniqueChildren = {}
    this.children_.forEach(c => {
      if (!uniqueChildren[c.id]) uniqueChildren[c.id] = this.initChild_(c)
      c = uniqueChildren[c.id]
      c.weight++
      if (this.shouldIterateOver_(c)) this.state_.iterableChildren.push(c)
    })
    this.state_.children = _.values(uniqueChildren)
  }

  initChild_(child) {
    child.weight = 0
    child.depth = this.state_.depth + 1
    child.parent = this.state_
    return child
  }

  shouldIterateOver_(child) {
    return this.calcVisitRate_(child.weight) >
        this.calcVisitRate_(child.weight - 1)
  }

  // How many times we should visit a state based on its weight.
  calcVisitRate_(weight) {
    return Math.round(Math.sqrt(weight))
  }

  getNextState(state) {
    if (state.iterations >= state.iterableChildren.length) {
      state.iterations = 0
      _.shuffleInPlace(state.children)
    }
    const child = state.iterableChildren[state.iterations]
    state.iterations++
    return child
  }
}

export default new StateIterator()
