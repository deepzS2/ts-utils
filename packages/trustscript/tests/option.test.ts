import { describe, it, expect } from 'vitest'

import { Option } from '../src'

describe('Option', () => {
  describe('new()', () => {
    it('Should create an instance of OptionSome for a non-null value', () => {
      const option = new Option('test')

      expect(option).toBeInstanceOf(Option)
      expect(option.isSome()).toBeTruthy()
      expect(option.isNone()).toBeFalsy()

      expect(option.unwrap()).toBe('test')
    })

    it('Should create an instance of OptionNone for a null or undefined value', () => {
      const option = new Option<any>(null)

      expect(option).toBeInstanceOf(Option)
      expect(option.isSome()).toBeFalsy()
      expect(option.isNone()).toBeTruthy()

      expect(() => option.unwrap()).toThrow()
    })
  })

  describe('map()', () => {
    it('Should map the value of the option using the provided mapper function if the option is Some', () => {
      const option = new Option('test')
      const mapped = option.map((value) => value.length)

      expect(mapped.isSome()).toBeTruthy()
      expect(mapped.unwrap()).toBe(4)
    })

    it('Should return an instance of OptionNone if the option is None', () => {
      const option = new Option<string>(null)
      const mapped = option.map((value) => value.length)

      expect(mapped.isNone()).toBeTruthy()
      expect(() => mapped.unwrap()).toThrow()
    })
  })

  describe('expect()', () => {
    it('Should return the value of the option if the option is Some', () => {
      const option = new Option('test')

      expect(option.expect('message')).toBe('test')
    })

    it('Should throw an error with the provided message if the option is None', () => {
      const option = new Option(null)

      expect(() => option.expect('error message')).toThrowError('error message')
    })
  })

  describe('unwrap()', () => {
    it('Should return the value of the option if the option is Some', () => {
      const option = new Option('test')

      expect(option.unwrapOr('default')).toBe('test')
    })

    it('Should throw an error if the option is None', () => {
      const option = new Option<string>(null)

      expect(() => option.unwrap()).toThrow()
    })
  })

  describe('unwrapOr()', () => {
    it('Should return the value of the option if the option is Some', () => {
      const option = new Option('test')

      expect(option.unwrapOr('default')).toBe('test')
    })

    it('Should return the provided default value if the option is None', () => {
      const option = new Option<string>(null)

      expect(option.unwrapOr('default')).toBe('default')
    })
  })

  describe('from()', () => {
    it('Should create an instance of OptionSome for a non-null value', () => {
      const option = Option.from('test')

      expect(option).toBeInstanceOf(Option)
      expect(option.isSome()).toBeTruthy()
      expect(option.isNone()).toBeFalsy()

      expect(option.unwrap()).toBe('test')
    })

    it('Should create an instance of OptionNone for a null or undefined value', () => {
      const option = Option.from(null)

      expect(option).toBeInstanceOf(Option)
      expect(option.isSome()).toBeFalsy()
      expect(option.isNone()).toBeTruthy()

      expect(() => option.unwrap()).toThrow()
    })
  })

  describe('isSome()', () => {
    it('Should return truthy if value is not none', () => {
      const option = Option.from('test')

      expect(option.isSome()).toBeTruthy()
    })

    it('Should return falsy if value is none', () => {
      const option = Option.from(null)

      expect(option.isSome()).toBeFalsy()
    })
  })

  describe('isNone()', () => {
    it('Should return truthy if value is none', () => {
      const option = Option.from(null)

      expect(option.isNone()).toBeTruthy()
    })

    it('Should return falsy if value is not none', () => {
      const option = Option.from('test')

      expect(option.isNone()).toBeFalsy()
    })
  })
})
