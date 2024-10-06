import notNull from "./notNull";

export function convertMapToMapSameKeys<K extends string, V, NV>(
    map: Record<K, V>,
    func: (e: { key: K; value: V }) => NV
): Record<K, NV> {
    const newMap = {} as Record<K, NV>

    for (const mapKey in map) {
        const key: K = mapKey as any as K
        if (key in map) {
            const value = map[key] as V | undefined
            newMap[key as any as K] = func({ key, value: notNull(value) })
        }
    }

    return newMap
}

export function convertMapToMap<K extends string, V, NK extends string, NV>(
    map: Record<K, V>,
    func: (e: { key: K; value: V }) => { key: NK; value: NV }
): Record<NK, NV> {
    const newMap = {} as Record<NK, NV>

    for (const mapKey in map) {
        const key: K = mapKey as any as K
        const value = map[key]
        const { key: newKey, value: newValue } = func({ key, value })

        newMap[newKey as any as NK] = newValue
    }

    return newMap
}