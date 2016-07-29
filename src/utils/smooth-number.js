import _ from 'underscore'

// Smoothly outputs an every changing number so it doesn't change too fast.
class SmoothNumber {
  constructor() {
    // The smoothed outputted value.
    this.value_ = null

    // Significant digit of output value.
    this.sigdig = 0.01

    this.lastUpdated_ = null
  }

  update(value) {
    if (this.value_ === null) {
      this.value_ = value;
    } else {
      this.moveSmoothedValue_(value)
    }
    this.lastUpdated_ = Date.now()
    return this.get()
  }

  get() {
    return this.value_;
  }

  moveSmoothedValue_(value) {
    const ratio = Math.abs(value - this.value_) / this.sigdig
    if (ratio < 2) return;
    const smoothness = this.sigdig * Math.pow(ratio, 1.5) / 3
    const dt = (Date.now() - this.lastUpdated_) / 1000;
    this.value_ = _.approach(this.value_, value, dt * smoothness)
  }
}

_.mixin({
  smoothNumber: () => new SmoothNumber(),
})
