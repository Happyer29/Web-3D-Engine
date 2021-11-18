type arrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' |  'unshift'
export type fixedLengthArray<T, L extends any, TObj = [T, ...Array<T>]> =
    Pick<TObj, Exclude<keyof TObj, arrayLengthMutationKeys>>
    & {
    readonly length: L
    [ I : number] : T
    [Symbol.iterator]: () => IterableIterator<T>
}