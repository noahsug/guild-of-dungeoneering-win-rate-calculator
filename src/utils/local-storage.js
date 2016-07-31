function hasLocalStorageSupport() {
  return window.localStorage &&
      window.localStorage.setItem &&
      window.localStorage.getItem
}

class Store {
  constructor() {
    this.store_ = hasLocalStorageSupport() ? window.localStorage : {}
  }

  setObj(key, obj) {
    this.store_[key] = JSON.stringify(obj)
  }

  getObj(key) {
    try {
      return JSON.parse(this.store_[key])
    } catch (e) {
      return null
    }
  }
}

export default new Store()
