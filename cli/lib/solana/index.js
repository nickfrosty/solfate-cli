/**
 *
 */

const { which, echo, exec, exit } = require("shelljs");

const SOLANA_CMD = "solana";

// import files for unified export
const config = require("./config");

const isInstalled = () => {
  if (which(SOLANA_CMD)) return true;
  return false;
};

const version = () => {
  if (!isInstalled()) return false;
  let version = exec(`${SOLANA_CMD} --version`, { silent: true }).stdout;
  return version?.split(" ")[1] || false;
};

module.exports = {
  version,
  isInstalled,
  ...config,
};

// module.exports = require("./solfate");
