import React, { createContext, useContext } from 'react'

/**
 * creates a context for stores and exposes utility functions to use that context
 * @param storeClass 
 * @returns utility functions wrapped in an object:
 * 
 * Provider - Wrapper around React context provider that only accepts the store we are dealing with
 * 
 * useProvidedStore - hook that can be used by components down in the tree to get an instance of the store. Will throw an error if the store wasn't provided using a Provider
 * 
 * useOptionalStore - same as useProvidedStore, but optional. If a provider wasn't used, it will return `undefined`
 * 
 * useProvidedTypedStore - same as useProvidedStore, but you can define a more specific type for your store. E.g. your store has generic types that are only known when you instantiate
 * the component (probably because the component itself also has generics)
 */
export function createStoreContext<T>(storeClass: { new(...params: any): T }) {
   const Context = createContext<T | undefined>(undefined)
   const useProvidedTypedStore = createUseTypedStore(Context, storeClass.name)
   const useProvidedStore = createUseStore(Context, storeClass.name)
   const useOptionalStore = createUseOptionalStore(Context, storeClass.name)

   function Provider(props: React.PropsWithChildren<{ store: T }>) {
      return (
         <>
            <Context.Provider value={props.store}>{props.children}</Context.Provider>
         </>
      )
   }

   return {
      Provider,
      useProvidedStore,
      useOptionalStore,
      useProvidedTypedStore
   }
}


function createUseTypedStore<T>(context: React.Context<T | undefined>, name: string): <T2 = T>() => T2 {
   context.displayName = name

   function useStore<T2 extends T = T>(): T2 {
      const localStoreContext = useContext(context)
      if (!localStoreContext) {
         throw new Error(
            `Please pass down the store first using a React.Context Provider (${context.displayName})`
         )
      }
      return localStoreContext as T2
   }

   return useStore as <T2 = T>() => T2
}

function createUseStore<T>(context: React.Context<T | undefined>, name: string): () => T {
   context.displayName = name

   function useStore(): T {
      const localStoreContext = useContext(context)
      if (!localStoreContext) {
         throw new Error(
            `Please pass down the store first using a React.Context Provider (${context.displayName})`
         )
      }
      return localStoreContext
   }

   return useStore
}

function createUseOptionalStore<T>(context: React.Context<T | undefined>, name: string) {
   context.displayName = name
   return (): T | undefined => {
      const localStoreContext = useContext(context)
      return localStoreContext
   }
}


