import { describe, it, expect } from 'vitest'

import { Result } from '../src'

describe('Result', () => {
  describe('new()', () => {
    it('Should create an Ok result when a value is provided', () => {
      const result = new Result(42, null)

      expect(result.isOk()).toBeTruthy()
      expect(result.isError()).toBeFalsy()
    })

    it('Should create an Error result when an error is provided', () => {
      const error = new Error('Something went wrong')
      const result = new Result(null, error)

      expect(result.isOk()).toBeFalsy()
      expect(result.isError()).toBeTruthy()
    })

    it('Should create an Error result when both a value and an error are provided', () => {
      const error = new Error('Something went wrong')
      const result = new Result(42, error)

      expect(result.isOk()).toBeFalsy()
      expect(result.isError()).toBeTruthy()
    })

    it('Should create an Ok result when no value or error are provided', () => {
      const result = new Result(null, null)

      expect(result.isOk()).toBeTruthy()
      expect(result.isError()).toBeFalsy()
    })
  })

  describe('map()', () => {
    it('Should apply the mapper function to the value of an Ok result', () => {
      const result = new Result<number, Error>(42, null)
      const mappedResult = result.map((x) => x.toString())

      expect(mappedResult.isOk()).toBeTruthy()
      expect(mappedResult.expect('Failed to map Ok result')).toBe('42')
    })

    it('Should not apply the mapper function to an Error result', () => {
      const error = new Error('Something went wrong')
      const result = new Result<string, Error>(null, error)

      const mappedResult = result.map((x) => x.toString())
      expect(mappedResult.isError()).toBeTruthy()
      expect(mappedResult.expectErr('Failed to map Err result')).toBe(error)
    })
  })

  describe('mapErr()', () => {
    it('Should apply the mapper function to the error of an Error result', () => {
      const error = new Error('Something went wrong')
      const result = new Result(null, error)
      const mappedResult = result.mapErr((e) => new Error(e.message.toUpperCase()))

      expect(mappedResult.isError()).toBeTruthy()
      expect(mappedResult.expectErr('Failed to map Err result')).toEqual(new Error('SOMETHING WENT WRONG'))
    })

    it('Should not apply the mapper function to an Ok result', () => {
      const result = new Result(42, null)
      const mappedResult = result.mapErr((e) => new Error(e.message.toUpperCase()))

      expect(mappedResult.isOk()).toBeTruthy()
      expect(mappedResult.expect('Failed to map Ok result')).toBe(42)
    })
  })

  describe('expect()', () => {
    it('Should return the value of an Ok result', () => {
      const result = new Result(42, null)

      expect(result.expect('Failed to unwrap Ok result')).toBe(42)
    })

    it('Should throw an error with the provided message when called on an Error result', () => {
      const error = new Error('Something went wrong')
      const result = new Result(null, error)

      expect(() => result.expect('Custom error message')).toThrowError('Custom error message')
    })
  })

  describe('expectErr()', () => {
    it('Should return the error of an Error result', () => {
      const error = new Error('error message')
      const result = new Result(null, error)

      expect(result.expectErr('error message')).toBe(error)
    })

    it('Should throw an error for an Ok result', () => {
      const result = new Result('value', null)

      expect(() => result.expectErr('error message')).toThrowError('error message')
    })
  })

  describe('unwrap()', () => {
    it('Should return the value of an Ok result', () => {
      const result = new Result(42, null)

      expect(result.unwrap()).toBe(42)
    })

    it('Should throw an error when called on an Error result', () => {
      const error = new Error('Something went wrong')
      const result = new Result(null, error)

      expect(() => result.unwrap()).toThrow()
    })
  })

  describe('unwrapOr()', () => {
    it('Should return the value of an Ok result', () => {
      const result = new Result(42, null)

      expect(result.unwrapOr(80)).toBe(42)
    })

    it('Should throw an error when called on an Error result', () => {
      const error = new Error('Something went wrong')
      const result = new Result<number, Error>(null, error)

      expect(result.unwrapOr(80)).toBe(80)
    })
  })

  describe('fromFunction()', () => {
    it('Should return an Ok result if function execution was successful', () => {
      const fn = (a: number, b: number): number => a + b
      const result = Result.fromFunction(fn, 2, 3)

      expect(result.isOk()).toBeTruthy()
      expect(result.isError()).toBeFalsy()
      expect(result.expect('Expected result to be a number')).toBe(5)
    })

    it('Should return an Error result if function execution throws an error', () => {
      const fn = (): never => {
        throw new Error('Function execution failed')
      }
      const result = Result.fromFunction(fn)

      expect(result.isOk()).toBeFalsy()
      expect(result.isError()).toBeTruthy()
      expect(result.expectErr('Expected result to be an Error')).toBeInstanceOf(Error)
    })

    it('Should return an Error result if function execution returns an error', () => {
      const fn = (): Error => new Error('Function execution failed')
      const result = Result.fromFunction(fn)

      expect(result.isOk()).toBeFalsy()
      expect(result.isError()).toBeTruthy()
      expect(result.expectErr('Expected result to be an Error')).toBeInstanceOf(Error)
    })
  })

  describe('fromAsyncFunction()', () => {
    const wait = async (seconds: number): Promise<void> => await new Promise((resolve, reject) => {
      setTimeout(resolve, seconds * 1000)
    })

    it('Should return Ok Result with the function result when the function resolves', async () => {
      const asyncFn = async (value: number): Promise<number> => {
        await wait(0.2)
        return value * 2
      }

      const result = await Result.fromAsyncFunction(asyncFn, 5)

      expect(result.isOk()).toBeTruthy()
      expect(result.isError()).toBeFalsy()
      expect(result.expect('error')).toBe(10)
    })

    it('Should return Error Result with the thrown error when the function rejects', async () => {
      const asyncFn = async (): Promise<void> => {
        await wait(0.2)
        throw new Error('Async function error')
      }

      const result = await Result.fromAsyncFunction(asyncFn)

      expect(result.isOk()).toBeFalsy()
      expect(result.isError()).toBeTruthy()
      expect(result.expectErr('error')).toEqual(new Error('Async function error'))
    })

    it('Should return Error Result with the returned error when the function returns an error object', async () => {
      const asyncFn = async (): Promise<Error> => {
        await wait(0.2)
        return new Error('Async function error')
      }

      const result = await Result.fromAsyncFunction(asyncFn)
      expect(result.isOk()).toBeFalsy()
      expect(result.isError()).toBeTruthy()
      expect(result.expectErr('error')).toEqual(new Error('Async function error'))
    })
  })

  describe('isOk()', () => {
    it('Should return true if error is null and not undefined', () => {
      const result = new Result<number, Error>(1, null)
      expect(result.isOk()).toBeTruthy()

      const result1 = new Result<number, Error>(null, null)
      expect(result1.isOk()).toBeTruthy()

      const result2 = new Result<number, Error>(undefined, null)
      expect(result2.isOk()).toBeTruthy()
    })
  })

  describe('isError()', () => {
    it('Should return false for a result with null error', () => {
      const value = 'Success!'
      const result = new Result(value, null)

      expect(result.isError()).toBeFalsy()
    })

    it('Should return true for a result with null value', () => {
      const error = new Error('Something went wrong')
      const result = new Result(null, error)

      expect(result.isError()).toBeTruthy()
    })

    it('Should return false for a result with both null value and error', () => {
      const result = new Result(null, null)

      expect(result.isError()).toBeFalsy()
    })
  })

  describe('ok()', () => {
    it('Should create a new Result instance with value when provided', () => {
      const value = 42
      const result = Result.ok(value)

      expect(result.isOk()).toBeTruthy()
      expect(result.isError()).toBeFalsy()
      expect(result.expect('Expecting a value')).toBe(value)
    })

    it('Should create a new Result instance with undefined value when not provided', () => {
      const result = Result.ok()

      expect(result.isOk()).toBeTruthy()
      expect(result.isError()).toBeFalsy()
      expect(result.expect('Expecting a value')).toBeUndefined()
    })
  })

  describe('error()', () => {
    it('Should create a new error Result', () => {
      const error = new Error('Something went wrong')
      const result = Result.error<string>(error)

      expect(result.isError()).toBeTruthy()
      expect(result.isOk()).toBeFalsy()
      expect(result.map(value => value.toUpperCase()).isError()).toBe(true)
      expect(result.mapErr(error => new Error(error.message.toUpperCase())).isError()).toBe(true)
      expect(() => result.expect('Expected an Ok Result')).toThrow('Expected an Ok Result')
      expect(result.expectErr('Expected an Err Result')).toEqual(error)
    })

    it('Should create a new error Result with a custom error type', () => {
      class CustomError extends Error {}

      const error = new CustomError('Something went wrong')
      const result = Result.error<string, CustomError>(error)

      expect(result.isError()).toBe(true)
      expect(result.isOk()).toBe(false)
      expect(result.map(value => value.toUpperCase()).isError()).toBe(true)
      expect(result.mapErr(error => new CustomError(error.message.toUpperCase())).isError()).toBe(true)
      expect(() => result.expect('Expected an Ok Result')).toThrow('Expected an Ok Result')
      expect(result.expectErr('Expected an Err Result')).toEqual(error)
    })
  })
})
