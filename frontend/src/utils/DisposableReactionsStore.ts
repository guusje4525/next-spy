import { autorun, IEqualsComparer, IReactionPublic, reaction } from 'mobx'

type Disposer = () => any

export function removeItemFromArray<T>(array: T[], item: T) {
    const index = array.indexOf(item)
    if (index >= 0) {
       array.splice(index, 1)
    }
    return index
 }

/** a store that `useStore` uses so you can register autoruns and reactions on your store, and useStore will dispose them automatically on unmount */
export default class DisposableReactionsStore {
   disposers = [] as Disposer[]
   dispose = () => {
      for (const disposer of this.disposers) {
         disposer()
      }
      this.disposers = []
   }
   registerDisposer(disposer: Disposer) {
      this.disposers.push(disposer)
   }

   removeDisposer(disposer: Disposer) {
      removeItemFromArray(this.disposers, disposer)
   }

   /** use this when:
    * 1 - you want to fine tune what does this reaction reacts to, using the observedExpression
    */
   registerReaction = <T, FireImmediately extends boolean = false>(params: {
      observedExpression: (r: IReactionPublic) => T
      reaction: (
         arg: T,
         prev: FireImmediately extends true ? T | undefined : T,
         r: IReactionPublic
      ) => void
      debounceDelay?: number
      onError?: (error: any) => void
      debugName?: string
      fireImmediately?: FireImmediately
      equals?: IEqualsComparer<T>
   }) => {
      this.registerDisposer(
         reaction(params.observedExpression, params.reaction, {
            delay: params.debounceDelay,
            onError: params.onError,
            name: params.debugName,
            fireImmediately: params.fireImmediately,
            equals: params.equals,
         })
      )
   }

   /** use this when:
    * 1 - you want the observer function to run whenever any of the referred observables change
    * 2 - you're ok that the observer function will run immediately
    */
   registerAutorun = (params: {
      observer: (r: IReactionPublic) => any
      debounceDelay?: number
      onError?: (error: any) => void
      debugName?: string
   }) => {
      this.registerDisposer(
         autorun(params.observer, {
            delay: params.debounceDelay,
            onError: params.onError,
            name: params.debugName,
         })
      )
   }
}
