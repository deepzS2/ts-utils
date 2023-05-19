export type None = undefined | null

export type OptionNone = None & { __kind: 'None' }
export type OptionSome<T> = T & { __kind: 'Some' }
