# Solfate CLI

Developer utility for building Solana programs

Learn more: [https://solfate.com/cli](https://solfate.com/cli)

## Setup and Install

Install the Solfate CLI from the NPM package registry:

```sh
npx i -g solfate
```

### Prerequisites

The Solfate CLI requires the following tools/programs to already be installed:

- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Rust and Cargo](https://rustup.rs/)
- [NodeJS](https://nodejs.org) > v14

## Commands

### `hot` :: hot reloading

Hot reload (aka auto rebuild) a Solana program on every file change to the program directory.

`solfate hot [path]`

#### Arguments

`path` _(optional)_ - relative or absolute path to the root of the Solana program

Default: `./program` - resolved to the current working directory
