//спасибо stackoverflow
// type arrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift' | number
// type arrayItems<T extends Array<any>> = T extends Array<infer TItems> ? TItems : never
// export type fixedLengthArray<T extends any[]> =
//     Pick<T, Exclude<keyof T, arrayLengthMutationKeys>>
//     & { [Symbol.iterator]: () => IterableIterator< arrayItems<T> > }


type arrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' |  'unshift'
export type fixedLengthArray<T, L extends any, TObj = [T, ...Array<T>]> =
    Pick<TObj, Exclude<keyof TObj, arrayLengthMutationKeys>>
    & {
    readonly length: L
    [ I : number] : T
    [Symbol.iterator]: () => IterableIterator<T>
}

// type Grow<T, A extends Array<T>> = ((x: T, ...xs: A) => void) extends ((...a: infer X) => void) ? X : never;
// type GrowToSize<T, A extends Array<T>, N extends dimension> = { 0: A, 1: GrowToSize<T, Grow<T, A>, N> }[A['length'] extends N ? 0 : 1];
//
// export type FixedArray<T, N extends dimension> = GrowToSize<T, [], N>;
let test: fixedLengthArray<number, 2>;
