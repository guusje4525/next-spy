import { makeAutoObservable } from "mobx"

export interface DebouncedLoadingStateParams {
  /** debounce time value to actually set the state. If just 'true' then sets to the
   * default debounce time (good for setting loading state)
   */
  debounce?: number
  initial?: boolean
}
export default class DebouncedLoadingState {
  timeout?: NodeJS.Timeout
  private params
  private state

  constructor(params: DebouncedLoadingStateParams = {}) {
    this.params = params
    this.state = params.initial || false
    makeAutoObservable(this)
    if (params.initial) {
      this.set()
    }
  }

  get isLoading() {
    return this.state
  }

  set = (debounce?: number) => {
    this.clear()
    this.timeout = setTimeout(() => {
      this.timeout = undefined
      this.state = true
    }, debounce ?? this.params.debounce ?? 300)
  }

  unset = () => {
    this.clear()
    this.state = false
  }

  clear = () => {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = undefined
    }
  }
}
