import _ from 'underscore'

export default class Performance {
  constructor() {
    this.stats_ = {}
  }

  start(name) {
    if (!this.stats_[name]) this.stats_[name] = { count: 0, elapsed: 0 }
    this.stats_[name].start = window.performance.now()
  }

  end(name) {
    const end = window.performance.now()
    const stat = this.stats_[name]
    stat.elapsed += end - stat.start
    stat.count++
    delete stat.start
  }

  print() {
    _.each(this.stats_, (stat, name) => {
      stat.avg = Number((stat.elapsed / stat.count).toFixed(2))
      stat.elapsed = Number(stat.elapsed.toFixed(0))
      console.log(name, stat)
    })
  }
}
