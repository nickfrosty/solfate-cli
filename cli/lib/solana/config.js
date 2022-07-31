/**
 * Utility functions for getting and setting Solana config settings
 */

const { which, echo, exec, exit } = require("shelljs");
const log = require("../utils/log");
const { loadSolfateConfig } = require("../utils/");

const SOLANA_CMD = "solana";

// define the base network "personalities"
const SOLANA_NETWORKS = {
  mainnet: {
    endpoint: "https://api.mainnet-beta.solana.com",
  },
  devnet: {
    endpoint: "https://api.devnet.solana.com",
  },
  testnet: {
    endpoint: "https://api.testnet.solana.com",
  },
  localnet: {
    endpoint: "http://localhost:8899",
  },
  // THOUGHTS:
  // adding a 'localhost' option to be an alias of "localnet"?
  // adding a 'mainnet-beta' option to be an alias of "mainnet"?
};

/**
 * Get and parse the Solana CLI config settings
 * @returns parsed config `object`
 */
const getConfig = (parse = true) => {
  // read in the current solana CLI config settings (when not already provided)
  let cliOutput = exec(`${SOLANA_CMD} config get`, {
    silent: true,
  })?.stdout;

  return parse ? parseConfig(cliOutput) : false;
};

/**
 * Parse the Solana CLI config settings into a usable object
 * @param {string} cliOutput (optional) output string from the Solana config command to parse
 *  - NOTE: the `solana config set` command auto returns the newlet set config settings
 * @returns formatted `object` of the parsed config settings
 * @returns `false` when failing to parse
 */
const parseConfig = (cliOutput = null) => {
  // read in the current solana CLI config settings (when not already provided)
  if (!cliOutput) cliOutput = getConfig(false);

  // break the lines of the cli output string
  cliOutput = cliOutput?.split("\n");

  // gracefully fail if the Solana CLI command result was invalid
  if (!cliOutput || !cliOutput?.length)
    return log.error("Unable to parse the Solana config");

  // construct the config object to return
  const config = {
    file: null,
    endpoint: null,
    ws: null,
    keypair: null,
    commitment: null,
  };

  // loop and parse each of the config lines
  for (let i = 0; i < cliOutput.length; i++) {
    if (!cliOutput[i]) break;

    // split the current working line and perform minor formatting
    let item = cliOutput[i].split(": ");
    item[0] = item[0].toLowerCase().trim();

    // parse each of the config settings into the `config` object
    if (item[0].startsWith("config")) config.file = item[1].trim();
    else if (item[0].startsWith("rpc")) config.endpoint = item[1].trim();
    else if (item[0].startsWith("keypair")) config.keypair = item[1].trim();
    else if (item[0].startsWith("commitment"))
      config.commitment = item[1].trim();
    else if (item[0].startsWith("websocket"))
      config.ws = item[1].trim().split(" ")[0];
  }

  return config;
};

/**
 * Set the Solana CLI configuration settings. Either by the named network personality, or as a keyed object
 * @param {object} config keyed object with the new Solana CLI configuration settings to save
 *  - `endpoint`    - URL of the RPC endpoint
 *  - `keypair`     - absolute path to the wallet keypair file
 *  - `file`        - absolute path to the Solana config file
 *  - `commitment`  - Solana network commitment level
 *  - `ws`          - websocket URL for the Solana cluster (usually auto computed by the Solana CLI when the `endpoint` url is updated)
 */
const setConfig = config => {
  if (!config) return false;

  // construct the base command to run
  const BASE_COMMAND = `${SOLANA_CMD} config set`;
  let command = BASE_COMMAND;

  // accept the `name` of a network personality
  if (typeof config === "string") {
    // load the default config
    const defaultConfig = SOLANA_NETWORKS[config.toLowerCase()] || false;

    // attempt to load and distill the local solfate config file
    let SolfateConfig = loadSolfateConfig()?.networks;
    if (typeof SolfateConfig === "object")
      SolfateConfig = SolfateConfig[config.toLowerCase()] || false;

    // ensure the provided network name was found
    if (!(SolfateConfig || defaultConfig))
      return log.error(`Unable to find network personality named "${config}"`);

    // construct a `config` object based on the provided personality name
    config = {
      ...defaultConfig,
      ...SolfateConfig,
    };
  }

  // parse the provided `config` settings to construct the CLI command to run
  if (config?.file) command = `${command} --config ${config?.file}`;
  if (config?.endpoint) command = `${command} --url ${config?.endpoint}`;
  if (config?.keypair) command = `${command} --keypair ${config?.keypair}`;
  if (config?.ws) command = `${command} --ws ${config?.ws}`;
  if (config?.commitment)
    command = `${command} --commitment ${config?.commitment}`;

  // basic check for an actuall command being generated
  if (command === BASE_COMMAND)
    return log.error("Unable to generate update command");

  // TODO: perform check of the `file` and `keypair` file existing?

  // run the Solana CLI command to set the new config settings
  let cliOutput = exec(command, { silent: true }).stdout;

  // parse and return the new config settings
  return parseConfig(cliOutput);
};

const isLocalnet = () => {
  return false;
};

const isDevnet = () => {
  return false;
};

const isTestnet = () => {
  return false;
};

const isMainnet = () => {
  return false;
};

module.exports = {
  getConfig,
  setConfig,
  isDevnet,
  isTestnet,
  isMainnet,
  isLocalnet,
};

// module.exports = require("./solfate");
