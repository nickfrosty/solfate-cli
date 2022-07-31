/**
 *
 */

const { Command } = require("commander");

// import local libs
const solana = require("../solana");
const log = require("../utils/log");

const command = new Command("set")
  .description("set Solana CLI configuration")
  .argument("[network]", `name of the network personality to set`)
  .option("-url, --endpoint", "Solana RPC endpoint URL")
  .option("-k, --keypair", "file path to the wallet keypair file")
  .option("-C, --file", "file path to the Solana config file")
  .option("-c, --commitment", "Solana network commitment level")
  .option(
    "-w, --ws",
    "websocket URL for the Solana cluster (usually auto computed when updating the endpoint)",
  )
  .action((network, options) => {
    // ensure either a network personality, or individual options were provided
    if (!network && !options?.length) {
      log.warn("No settings were changed");
      return;
    }

    // attempt to set the new configuration based on the input
    if (network && solana.setConfig(network))
      log.success(`Solana set to "${network}" personality`);
    else if (options?.length && solana.setConfig(network))
      log.success("Solana configuration updated");
    else log.error("Updated network config was NOT set");
  });

module.exports = command;
