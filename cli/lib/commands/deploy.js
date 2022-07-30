/**
 *
 */

const { Command } = require("commander");

// import local libs
const solana = require("../solana");

const deploy = new Command("deploy")
  .description("deploy a Solana/Anchor program")
  .argument("[program]", "root of the Solana program directory")
  .option("-m, --mainnet", "deploy to the 'mainnet' network")
  .option("-t, --testnet", "deploy to the 'testnet' network")
  .option("-l, --localnet", "deploy to the 'localnet' network")
  // .option("-s, --separator <char>", "separator character", ",")
  .action((arg, options) => {
    console.log("arg", arg);
    console.log("options", options);
  });

module.exports = deploy;
