# `TRustScript`

The package implements some of the features present in the Rust programming language, which are:

- [`Option`](./src/option.ts): The Option type provides a way to express the presence or absence of a value. It is used to handle situations where a value may or may not exist.

- [`Result`](./src/result.ts): The Result is used to handle operations that can either succeed or fail. It allows for more explicit error handling and propagation of errors throughout the code, similar to Rust's Result type.

These features aim to bring some of the functional error handling and optional value handling capabilities from Rust to the Node.js and TypeScript environment.

## Usage

```typescript
import { Option } from '@deepzs/trustscript'

// Initializing option 
const option = new Option('Hello!')
// OR
const option = Option.from('Hello!')

const someOption = Option.from('Hello!')
console.log(options.isSome()) // true
console.log(options.isNone()) // false
console.log(options.unwrap()) // "Hello!"
console.log(options.unwrapOr("default")) // "Hello!"
console.log(options.expect("What happened?")) // "Hello!"
console.log(options.map((str) => `${str} World!`).unwrap()) // Hello World!

const noneOption = Option.from<string>(undefined)
console.log(noneOption.isSome()) // false
console.log(noneOption.isNone()) // true
console.log(noneOption.unwrap()) // Error: Unwrapped value is None
console.log(noneOption.unwrapOr("default")) // "default"
console.log(noneOption.expect("What happened?")) // Error: What happened?
console.log(noneOption.map((str) => `${str} World!`).unwrap()) // Error: Unwrapped value is None
```
