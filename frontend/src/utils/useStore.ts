import DisposableReactionsStore from './DisposableReactionsStore'
import { isObservableObject, makeAutoObservable, observable, runInAction } from 'mobx'
import { useEffect } from 'react'
import useRefFn from './useRefFn'

export type useStoreInitializer<T> = () => T
export type useStoreWithPropsInitializer<T, P> = (sourceProps: P) => T

export interface IStoreWithReactions extends AnyObject {
   configureReactions: (reactionsStore: DisposableReactionsStore) => any
}

function instanceOfStoreWithReactions(object: any): object is IStoreWithReactions {
   if (!object) {
      return false
   }
   return 'configureReactions' in object
}

/**
 * use this hook to instantiate a mobx store, whether it's class-based or a plain object.
 * @param initializer method that should instantiate a new instance of a store class, that holds observables, actions and computed properties
 * if the instance is not an observable object, useStore will execute `makeAutoObservable` on it
 * @param sourceProps props that you would like to turn into a observable source, which will be passed inside a object as a parameter to the initializer.
 */
export default function useStore<T extends (object | undefined), P extends object>(
   initializer: useStoreInitializer<T> | useStoreWithPropsInitializer<T, P>,
   sourceProps?: P
): T {

   // instantiates the store that will hold the sourceProps as shallow observables.
   // this is done so that the store will be updated when the sourceProps change (does not account for deeper levels on nested objects)
   const { current: observableSourceStore } = useRefFn(() => {
      if (sourceProps) {
         return observable(sourceProps, undefined, { deep: false })
      }
      return undefined
   })

   const isInitializerWithoutProps = (init: typeof initializer): init is useStoreInitializer<T> => {
      return init.length === 0
   }

   // instantiates the store itself using the initializer function
   const { current: store } = useRefFn(() => {
      const initializerHasProps = !isInitializerWithoutProps(initializer)
      const sourcePropsWereGiven = observableSourceStore !== undefined

      // checks whether source props passed are compatible with the initializer function signature
      if ((!initializerHasProps && sourcePropsWereGiven)) {
         throw new Error(
            'You have passed a store initializer that accepts props, but you did not pass any props'
         )
      }

      // checks whether source props passed are compatible with the initializer function signature
      if (initializerHasProps && !sourcePropsWereGiven) {
         throw new Error(
            'You have passed a store initializer that does not accept props, but you did pass props'
         )
      }

      // if the initializer is a function that accepts props, we pass the observableSourceStore as a parameter
      const st = !initializerHasProps
         ? initializer()
         : sourcePropsWereGiven
            ? initializer(observableSourceStore as P)
            : initializer({} as P) // this will never happen, but it's here to satisfy the compiler

      if (!isObservableObject(st) && st !== undefined) {
         makeAutoObservable(st)
      }
      return st
   })

   // instantiates the disposable store, which will hold the reactions and be disposed on unmount
   const { current: reactionsStore } = useRefFn(() => {
      if (instanceOfStoreWithReactions(store) && !!store.configureReactions) {
         const dt = new DisposableReactionsStore()
         store.configureReactions(dt)
         return dt
      }
      return undefined
   })

   const sourcePropsValues = sourceProps ? Object.values(sourceProps) : []
   // creates array with sourceProps keys
   const sourcePropsKeys = sourceProps ? Object.keys(sourceProps) : []
   // monitors any changes on the source props. If something changes, then our observable source is updated.
   useEffect(() => {
      runInAction(() => {
         if (observableSourceStore) {

            for (let i = 0; i < sourcePropsKeys.length; i++) {
               const key = sourcePropsKeys[i] as keyof typeof observableSourceStore;
               const value = sourcePropsValues[i];

               if (observableSourceStore[key] !== value) {
                  // this is where a observation might be triggered because `observableSourceStore[key]` is an observable
                  observableSourceStore[key] = value
               }
            }
         }
      })

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [...sourcePropsValues, ...sourcePropsKeys, observableSourceStore])

   // disposes our disposable store on unmount
   useEffect(() => {
      return () => reactionsStore?.dispose()
   }, [reactionsStore])

   return store
}
