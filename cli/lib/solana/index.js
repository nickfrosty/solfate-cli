/**
 *
 */

const { which, echo, exec, exit } = require("shelljs");
const log = require("../utils/log");
const fs = require("fs");

const SOLANA_CMD = "solana";

// current airdrop limit in the Solana CLI for a single airdrop request
const DEFAULT_AIRDROP_QTY = 1;

// import files for unified export
const config = require("./config");

/**
 * Check if the Solana CLI is installed on the system
 * @returns `boolean`
 */
const isInstalled = () => {
  if (which(SOLANA_CMD)) return true;
  return false;
};

/**
 * Retreive the current version of the Solana CLI
 * @returns current version number as a `string`
 */
const version = () => {
  if (!isInstalled()) return false;
  let version = exec(`${SOLANA_CMD} --version`, { silent: true }).stdout;
  return version?.split(" ")[1] || false;
};

/**
 * Retreive the wallet address of from a local keyfile
 * @param {string} filePath absolute file path of a local keyfile
 * @returns string of the public key wallet address
 */
const address = filePath => {
  let address = exec(`${SOLANA_CMD} address -k ${filePath}`, { silent: true })
    .stdout;
  return (address && address) || false;
};

/**
 * Check and return the current balance of a wallet
 * @param {string} wallet public key address or absolute path to a local key file
 * @returns the current SOL balance on the current cluster
 */
const balance = (wallet = "") => {
  // auto convert an `wallet` file path to a wallet address
  if (wallet?.startsWith("/") && fs.existsSync(wallet))
    wallet = address(wallet);

  let balance = exec(`${SOLANA_CMD} balance ${wallet}`, { silent: true })
    .stdout;
  return parseFloat(balance?.split(" ")?.[0] || 0) || false;
};

/**
 * Request a SOL airdrop from the current cluster
 * @param {string} address wallet address to airdrop SOL to (defaults to the current config wallet)
 * @param {number} amount quantity of SOL to request in the airdrop
 * @param {boolean} async whether or not to request the airdrop as async or not
 */
const airdrop = async (
  address = "",
  amount = DEFAULT_AIRDROP_QTY,
  async = true,
) => {
  log.info(`Requesting airdrop of ${amount} SOL`);

  // execute the airdrop request command
  const cliOutput = exec(
    `${SOLANA_CMD} airdrop ${amount} ${address}`,
    {
      silent: true,
      async: async,
    },
    function(code, stdout, stderr) {
      if (code === 0) {
        log.success(`Airdropped ${amount} SOL`);
        // log.info(stdout);
      } else {
        log.error(`Airdrop failed!`);
        log.error(stderr);
      }
    },
  );
};

/**
 * Request a SOL airdrop, but only if the current wallet's balance is lower than the `amount`
 * @param {string} wallet public key wallet address to check and airdrop to
 * @param {number} amount quantity of SOL to request in the airdrop
 * @returns the final balance of the wallet address
 */
const airdropOnLowBalance = (wallet = "", amount = DEFAULT_AIRDROP_QTY) => {
  const current = balance(wallet);

  // only airdrop if the current balance is low
  if (current < amount) {
    log.info(`Current SOL balance: ~${Math.ceil(current)} SOL`);
    airdrop(wallet, amount);
    current = balance(wallet);
    return current + amount;
  }

  return current;
};

/**
 * Deploy a Solana program to the current network cluster
 * @param {string} binaryPath absolute path to the compiled Solana program binary
 * @param {string} keyfilePath absolute path to the keyfile used to deploy the program
 * @returns successfully deployed program id or `false` on failure to deploy
 */
const deploy = ({ binaryPath, keyfilePath }) => {
  log.info("Deploying Solana program...");

  // validate the `deploySettings` provided
  if (!binaryPath) return log.error("No program binary path provided");
  if (!keyfilePath) return log.error("No program keyfile path provided");

  // display info about the deploy settings
  log.notice(`Binary file: ${binaryPath}`);
  log.notice(`Keyfile file: ${keyfilePath}`);

  // run the deploy command
  let cliOutput = exec(
    `${SOLANA_CMD} program deploy ${binaryPath} -k ${"~/.config/solana/solfate-dev.json"} --program-id ${address(
      keyfilePath,
    )}`,
    { silent: true },
  );

  // process the command output
  if (cliOutput.code === 0) {
    log.success(`DEPLOY SUCCESS! ${cliOutput.stdout}`);

    // extract the program id
    const programId = cliOutput.stdout.split(":")?.[1].trim();
    return programId;
  } else return log.error(cliOutput?.stderr || "An unknown error occured");
};

module.exports = {
  version,
  isInstalled,
  deploy,
  airdrop,
  balance,
  airdropOnLowBalance,
  ...config,
};
