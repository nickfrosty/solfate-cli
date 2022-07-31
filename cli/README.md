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

## Configuration file

The Solfate CLI supports loading a user define `solfate.config.js` file from inside your project's repo/working directory.

An example config file can be located here in this repo: [solfate.config.js](./solfate.config.js)

### Locating the config file

The Solfate CLI will attempt to locate and resolve the `solfate.config.js` file in the following manner:

1. checking your current working directory (aka the directory your terminal is running the `solfate` command from)
2. crawling up a set max number of directories (currently `MAX_CRAWL_DEPTH=5`)
3. stopping when the config file (or a `.git` directory) is located (usually `.git` signifying the root of your repo)

## Commands

### `hot` :: hot reloading

Hot reload (aka auto rebuild) a Solana program on every file change to the program directory.

`solfate hot [path]`

#### Arguments and

`path` _(optional)_ - relative or absolute path to the root of the Solana program

Default: `./program` - resolved to the current working directory

### `set` :: set Solana network settings

Set Solana CLI network settings, either by a network "personality" name or individually setting records

`solfate set [network]`

> NOTE: Either a network personality name, or at least one individual setting `option` is required to use `set`

#### Arguments and Options

`network` _(optional)_ - name of the network "personality" to set as your Solana config settings

`--endpoint` - Solana RPC endpoint URL

`--keypair` - file path to the wallet keypair file

`--file` - file path to the Solana config file

`--commitment` - Solana network commitment level

`--ws` - websocket URL for the Solana cluster (usually auto computed when updating the endpoint
