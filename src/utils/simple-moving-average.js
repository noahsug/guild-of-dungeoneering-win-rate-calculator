import _ from 'underscore'

class SMA {
  constructor(period = 10) {
    this.values_ = new Array(period)
    this.index_ = 0  // current place in value array
    this.sum = 0  // sum of stored values
    this.count = 0  // number of stored values
    this.iterations = 0  // number of times add() is called
  }

  get period() {
    return this.values_.length
  }

  set period(period) {
    const diff = period - this.values_.length
    if (diff < 0) _.fail('unimplemented')
    this.values_ = this.values_.slice(0, this.index_)
        .concat(new Array(diff))
        .concat(this.values_.slice(this.index_))
  }

  get value() {
    return this.sum / this.count
  }

  add(value) {
    this.iterations++
    let prevValue = this.values_[this.index_]
    if (prevValue === undefined) {
      this.count++
      prevValue = 0
    }
    this.sum += value - prevValue
    this.values_[this.index_] = value
    this.index_ = (this.index_ + 1) % this.values_.length
  }

  get variance() {
    const avg = this.value
    let sum = 0
    let count = 0
    const increment = this.count > 12 ? 4 : 1
    for (let i = 0; i < this.count; i += increment) {
      const value = this.values_[i]
      if (value === undefined) continue
      sum += Math.pow(value - avg, 2)
      count++
    }
    return sum / count
  }
}

_.mixin({
  simpleMovingAverage: (period) => new SMA(period),
})
