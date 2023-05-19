import type { None, OptionNone, OptionSome } from './types'

/**
 * Option rust implementation
 */
export class Option<T> {
  private readonly _value: OptionSome<T> | OptionNone

  constructor (value: T | None) {
    this._value = value as OptionSome<T> | OptionNone
  }

  /**
   * Check if option value is Some
   */
  isSome (): boolean {
    return Option.isSome(this._value)
  }

  /**
   * Check if option value is None
   */
  isNone (): boolean {
    return Option.isNone(this._value)
  }

  /**
   * Maps the value of the option to a new value using a mapper function,
   * returns a new Option with the mapped value
   */
  map<U>(mapper: (value: T) => U): Option<U> {
    if (this.isSome()) {
      return new Option<U>(mapper(this._value))
    } else {
      return new Option<U>(undefined)
    }
  }

  /**
   * Returns the value of the option if it is Some, otherwise throws an error
   * @param message Error message
   */
  expect (message: string): T {
    if (this.isSome()) {
      return this._value
    } else {
      throw new Error(message)
    }
  }

  /**
   * Returns the value of the option if it is Some, otherwise throws an error
   */
  unwrap (): T {
    if (this.isSome()) {
      return this._value
    } else {
      throw new Error('Unwrapped value is None')
    }
  }

  /**
   * Returns the value of the option if it is Some, otherwise returns a default value
   */
  unwrapOr (defaultValue: T): T {
    if (this.isSome()) {
      return this._value
    } else {
      return defaultValue
    }
  }

  /**
   * Create an Option instance from a value
   */
  static from<T>(value: T | None): Option<T> {
    return new Option<T>(value)
  }

  /**
   * Check if value is Some
   */
  static isSome<T>(value: unknown): value is OptionSome<T> {
    return value !== undefined && value !== null
  }

  /**
   * Check if value is None
   */
  static isNone (value: unknown): value is OptionNone {
    return value === undefined || value === null
  }
}
