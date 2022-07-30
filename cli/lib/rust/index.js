/**
 *
 */

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

const build = (progDir = null) => {
  if (!progDir || !isInstalled()) return false;

  const buildCommand = `cd ${path.resolve(progDir)} && ${CARGO_CMD} build-bpf`;

  log.info("Building program...");

  // exec the cargo build command
  // handle the success conditions (and stop processing)
  if (exec(buildCommand, { silent: true }).code === 0) {
    log.success("Build success!");
    return true;
  }

  // when the first build fails, rebuild with verbose logging
  log.error("--------------------------------------");
  log.error("Build FAILD!");
  log.error("--------------------------------------\n");

  // exec the cargo build command
  const output = exec(buildCommand, { silent: false });
  // console.log(output?.stdout);

  log.error("--------------------------------------");
  log.error("Update and save changes to rebuild");
  log.error("--------------------------------------");
  return false;
};

module.exports = {
  version,
  isInstalled,
  build,
};
