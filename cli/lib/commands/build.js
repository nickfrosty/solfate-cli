/**
 *
 */

const { Command } = require("commander");
const path = require("path");

// import local libs
const solana = require("../solana");
const rust = require("../rust");
const log = require("../utils/log");

const DEFAULT_PROGRAM_DIR = "./program";

const command = new Command("build")
  .description("build a Solana/Anchor program")
  .argument("[program]", "root of the Solana program directory")
  .option("-d, --deploy", "auto deploy program after build")
  // .option("-m, --mainnet", "deploy to the 'mainnet' network")
  // .option("-t, --testnet", "deploy to the 'testnet' network")
  // .option("-l, --localnet", "deploy to the 'localnet' network")
  .action((progDir, options) => {
    progDir = path.resolve(progDir ? progDir : DEFAULT_PROGRAM_DIR);

    // run the build command
    const deploySettings = rust.build(progDir, true);

    // ensure the build was successful
    if (!deploySettings) return false;

    // handle deploying after a successful build
    if (options?.deploy) {
      // check the current balance to ensure enough funds
      solana.airdropOnLowBalance();

      // deploy the program to the current network cluster
      solana.deploy(deploySettings);
    }

    return true;
  });

module.exports = command;
