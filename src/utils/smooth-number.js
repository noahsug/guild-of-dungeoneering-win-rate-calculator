import _ from 'underscore'

// Smoothly outputs an every changing number so it doesn't change too fast.
class SmoothNumber {
  constructor(value) {
    // The smoothed outputted value.
    this.value_ = _.ifDef(value, NaN)

    // Significant digit of output value.
    this.sigdig = 0.01

    this.lastUpdated_ = null

    // Used to
    this.traveled_ = 0
  }

  update(value) {
    if (!isFinite(value)) return this.value_
    if (isNaN(this.value_)) {
      this.value_ = value
    } else {
      this.update_(value)
    }
    this.lastUpdated_ = Date.now()
    return this.value_
  }

  get() {
    return this.value_
  }

  update_(value) {
    // Move faster relative to the square of how far away we are from the actual
    // value.
    const distance = Math.abs(value - this.value_) / (2 * this.sigdig)
    if (distance < .8) return

    // Slow down over time, based on total distance traveled.
    const drag = Math.max(1, 0.2 * this.traveled_ / this.sigdig - 25)
    // Number of units to update the value each second.
    const speed = this.sigdig * Math.pow(distance, 2) / drag
    // How much time has passed.
    const dt = (Date.now() - this.lastUpdated_) / 1000

    const prevValue = this.value_
    this.value_ = _.approach(this.value_, value, dt * speed)
    this.traveled_ += Math.abs(this.value_ - prevValue)
  }
}

_.mixin({
  smoothNumber: () => new SmoothNumber(),
})
