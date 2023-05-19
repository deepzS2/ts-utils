import type { None } from './types'

/**
 * Result rust implementation
 */
export class Result<T, E extends Error> {
  private readonly value: T | None
  private readonly error: E | None

  constructor (value: T | None, error: E | None) {
    this.value = value
    this.error = error
  }

  /**
   * Check if value is Ok
   */
  isOk (): boolean {
    return !this.isError()
  }

  /**
   * Check if value is Error
   */
  isError (): boolean {
    return (this.error !== undefined || this.error !== null) && this.error instanceof Error
  }

  /**
   * Maps the value of the result to a new value using a mapper function,
   * returns a new Result with the mapped value
   */
  map<U>(mapper: (value: T) => U): Result<U, E> {
    if (this.isOk()) {
      return new Result<U, E>(mapper(this.value!), null)
    } else {
      return new Result<U, E>(null, this.error)
    }
  }

  /**
   * Maps the error of the result to a new error using a mapper function,
   * returns a new Result with the mapped error
   */
  mapErr<F extends Error>(mapper: (error: E) => F): Result<T, F> {
    if (this.isError()) {
      return new Result<T, F>(null, mapper(this.error!))
    } else {
      return new Result<T, F>(this.value, null)
    }
  }

  /**
   * Returns the value of the result if it is Ok, otherwise throws an error
   * @param message Error message
   */
  expect (message: string): T {
    if (this.isOk()) {
      return this.value!
    } else {
      throw new Error(message)
    }
  }

  /**
   * Returns the error of the result if it is Err, otherwise throws an error
   * @param message Error message
   */
  expectErr (message: string): E {
    if (this.isError()) {
      return this.error!
    } else {
      throw new Error(message)
    }
  }

  /**
   * Returns the value of the result if it is Ok, otherwise throws an error
   */
  unwrap (): T {
    if (this.isOk()) {
      return this.value!
    } else {
      throw new Error('Unwrapped value is Error')
    }
  }

  /**
   * Returns the value of the result if it is Ok, otherwise returns a default value
   */
  unwrapOr (defaultValue: T): T {
    if (this.isOk()) {
      return this.value!
    } else {
      return defaultValue
    }
  }

  /**
   * Create a Result from a function
   * @param fn Function
   * @param args Function arguments
   * @returns
   */
  static fromFunction<T extends (...args: any[]) => any, E extends Error, Return = ReturnType<T>>(fn: T, ...args: Parameters<T>): Result<Return, E> {
    try {
      const result = fn(...args)

      // In case of the function return error and not throwing
      if (result instanceof Error) {
        throw result
      }

      return new Result<Return, E>(result, undefined)
    } catch (error) {
      return new Result<Return, E>(undefined, error as E)
    }
  }

  /**
   * Create a Result from a async function
   * @param fn Async function
   * @param args Async function arguments
   */
  static async fromAsyncFunction<T extends (...args: any[]) => Promise<any>, E extends Error, Return = Awaited<ReturnType<T>>>(fn: T, ...args: Parameters<T>): Promise<Result<Return, E>> {
    try {
      const result = await fn(...args)

      // In case of the function return error and not throwing
      if (result instanceof Error) {
        throw result
      }

      return Result.ok(result)
    } catch (error) {
      return Result.error(error as E)
    }
  }

  /**
   * Create a new Ok Result
   * @param value Ok Result value
   */
  static ok<T, E extends Error = Error>(value?: T): Result<T, E> {
    return new Result<T, E>(value, undefined)
  }

  /**
   * Create a new Error Result
   * @param value Error Result value
   */
  static error<T, E extends Error = Error>(value: NonNullable<E>): Result<T, E> {
    return new Result<T, E>(undefined, value)
  }
}
