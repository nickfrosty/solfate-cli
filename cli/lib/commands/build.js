/**
 *
 */

const { Command } = require("commander");

// import local libs
const solana = require("../solana");

const build = new Command("build")
  .description("build a Solana/Anchor program")
  .argument("[program]", "root of the Solana program directory")
  // .option("-m, --mainnet", "deploy to the 'mainnet' network")
  // .option("-t, --testnet", "deploy to the 'testnet' network")
  // .option("-l, --localnet", "deploy to the 'localnet' network")
  .action((arg, options) => {
    // console.log("arg", arg);
    // console.log("options", options);
  });

module.exports = build;
