import { useRef } from "react"

/** Symbol representing that the initializer function has not run yet. */
const symUninitialized = Symbol("Initial Value for useRefFn")

export default function useRefFn<T>(initialValueFn: () => T) {
    const ref = useRef<typeof symUninitialized | T>(symUninitialized)
    if (ref.current === symUninitialized) {
        ref.current = initialValueFn()
    }
    return ref as React.MutableRefObject<T>
}