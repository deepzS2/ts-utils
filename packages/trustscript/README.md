# `TRustScript`

The package implements some of the features present in the Rust programming language, which are:

- [`Option`](./src/option.ts): The Option type provides a way to express the presence or absence of a value. It is used to handle situations where a value may or may not exist.

- [`Result`](./src/result.ts): The Result is used to handle operations that can either succeed or fail. It allows for more explicit error handling and propagation of errors throughout the code, similar to Rust's Result type.

These features aim to bring some of the functional error handling and optional value handling capabilities from Rust to the Node.js and TypeScript environment.

## Usage

### Option type

```typescript
import { Option } from '@deepzs/trustscript'

// Initializing option 
const option = new Option('Hello!')
// OR
const option = Option.from('Hello!')

const someOption = Option.from('Hello!')
console.log(someOption.isSome()) // true
console.log(someOption.isNone()) // false
console.log(someOption.unwrap()) // "Hello!"
console.log(someOption.unwrapOr("default")) // "Hello!"
console.log(someOption.expect("What happened?")) // "Hello!"
console.log(someOption.map((str) => `${str} World!`)) // Option { _value: "Hello World!" }

const noneOption = Option.from<string>(undefined)
console.log(noneOption.isSome()) // false
console.log(noneOption.isNone()) // true
console.log(noneOption.unwrap()) // Error: Unwrapped value is None
console.log(noneOption.unwrapOr("default")) // "default"
console.log(noneOption.expect("What happened?")) // Error: What happened?
console.log(noneOption.map((str) => `${str} World!`)) // Option { _value: undefined }
```

### Result type

```typescript
import { Result } from '@deepzs/trustscript'

// Initializing option 
const result = new Result<string, Error>('Hello!', null)
// OR
const result = Result.fromFunction<string, Error>(() => 'Hello!')
// OR
const result = Result.fromAsyncFunction<string, Error>(() => new Promise((resolve) => resolve('Hello!')))
// OR
const myFunction = (arg1: boolean): Result<string, Error> => {
  if (arg1) {
    return Result.ok('Hello!')
  } else {
    return Result.error(new Error('Falsy...'))
  }
}

const successResult = new Result<string, Error>('Hello!', null)
console.log(successResult.isOk()) // true
console.log(successResult.isError()) // false
console.log(successResult.unwrap()) // "Hello!"
console.log(successResult.unwrapOr("default")) // "Hello!"
console.log(successResult.expect("What happened?")) // "Hello!"
console.log(successResult.expectErr("Should be an error")) // Error: Should be an error
console.log(successResult.map((str) => `${str} World!`)) // Result { value: "Hello World!", error: undefined }
console.log(successResult.mapErr((e) => new Error(e.message.toUpperCase())).unwrap()) // Result { value: "Hello!", error: undefined }

const errorResult = new Result<string, Error>(undefined, new Error('MyCustomError'))
console.log(options.isOk()) // false
console.log(options.isError()) // true
console.log(options.unwrap()) // Error: Unwrapped value is Error
console.log(options.unwrapOr("default")) // "default"
console.log(options.expect("What happened?")) // Error: What happened?
console.log(options.expectErr("Should be an error")) // Error { message: "MyCustomError" }
console.log(options.map((str) => `${str} World!`)) // Result { value: undefined, error: Error { message: "MyCustomError" } }
console.log(options.mapErr((e) => new Error(e.message.toUpperCase()))) // Result { value: undefined, error: Error { message: "MYCUSTOMERROR" } }
```
