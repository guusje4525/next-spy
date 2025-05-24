import { makeAutoObservable } from "mobx"
import DebouncedLoadingState from "./DebouncedLoadingState"

export default class Loader {
  count = 0
  private loading: DebouncedLoadingState
  private _loaderText: string | undefined = undefined

  constructor(initialValue?: boolean) {
    this.loading = new DebouncedLoadingState({ initial: initialValue, debounce: 0 })
    makeAutoObservable(this)
  }

  get isLoading() {
    return this.loading.isLoading
  }

  get loaderText() {
    return this._loaderText
  }

  executeLoading = async <R>(action: () => Promise<R>, loaderText?: string): Promise<R> => {
    if (loaderText) this._loaderText = loaderText
    let ret: R
    this.count++
    if (this.count === 1) {
      this.loading.set()
    }
    try {
      ret = await action()
    } finally {
      // this is executed even when an error is re-thrown
      this.count--
      if (this.count === 0) {
        this.loading.unset()
      }
    }

    return ret
  }
}
