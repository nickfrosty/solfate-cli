/**
 *
 */

const fs = require("fs");
const path = require("path");
const { which, echo, exec, exit } = require("shelljs");

const log = require("../utils/log");

const CARGO_CMD = "cargo";

const isInstalled = () => {
  if (which(CARGO_CMD)) return true;
  return false;
};

const version = () => {
  if (!isInstalled()) return false;
  let version = exec(`${CARGO_CMD} --version`, { silent: true }).stdout;
  return version?.split(" ")[1] || false;
};

const build = (progDir = null, returnDeploySettings = false) => {
  if (!progDir || !isInstalled()) return false;

  const buildCommand = `cd ${path.resolve(progDir)} && ${CARGO_CMD} build-bpf`;

  log.info("Building program...");

  // exec the cargo build command
  // handle the success conditions (and stop processing)
  let cliOutput = exec(buildCommand, { silent: true });
  if (cliOutput.code === 0) {
    log.success("Build success!");

    return returnDeploySettings
      ? extractDeploySettings(cliOutput?.stdout)
      : true;
  }

  // when the first build fails, rebuild with verbose logging
  log.error("--------------------------------------");
  log.error("Build FAILD!");
  log.error("--------------------------------------\n");

  // exec the cargo build command
  cliOutput = exec(buildCommand, { silent: false });
  // console.log(cliOutput?.stdout);

  return false;
};

/**
 * Parse and extract the deploy settings that are output from the build command
 * @param {string} cliOuput the output of the the build's `exec` command
 */
const extractDeploySettings = cliOutput => {
  if (!cliOutput) return false;

  // define the base structure of the data to extract
  const deploySettings = {
    binaryPath: null,
    keyfilePath: null,
  };

  // break the lines of the cli output string
  cliOutput = cliOutput?.split("\n").reverse();

  // define the max number of lines from the build output to parse
  // NOTE: the desired lines should be in the last few lines, so this will help prevent false positives
  const MAX_LINES_TO_PARSE = 5;

  // parse the build output to extract the build info
  for (let i = 0; i <= MAX_LINES_TO_PARSE; i++) {
    let line = cliOutput[i].trim();
    if (line === "") continue;

    // extract the json key file for the newly built Solana binary
    if (line.endsWith(".json")) {
      if (fs.existsSync(path.resolve(line)))
        deploySettings.keyfilePath = path.resolve(line);
      // else deploySettings.keyfilePath = false;
    }
    // extract the path for the newly built Solana binary
    else if (line.endsWith(".so")) {
      line = line?.substring(line?.indexOf(path.sep));
      if (fs.existsSync(path.resolve(line)))
        deploySettings.binaryPath = path.resolve(line);
      // else deploySettings.binaryPath = false;
    }

    // stop processing when the settings have been extracted
    if (deploySettings?.keyfilePath && deploySettings?.binaryPath) {
      break;
    }
  }

  return deploySettings;
};

module.exports = {
  version,
  isInstalled,
  extractDeploySettings,
  build,
};
