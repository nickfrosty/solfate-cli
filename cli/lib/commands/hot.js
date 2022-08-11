/**
 *
 */

const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const { Command } = require("commander");

// import local libs
const solana = require("../solana");
const rust = require("../rust");
const log = require("../utils/log");

const DEFAULT_PROGRAM_DIR = "./program";

const command = new Command("hot")
  .description("auto rebuild your Solana program")
  .argument(
    "[program directory]",
    `relative path of the root of the Solana program; default="${DEFAULT_PROGRAM_DIR}"`,
  )
  .option(
    "-d, --deploy",
    "enable auto deployments (only using the local test validator)",
  )
  .action((progDir, options) => {
    // set the default program directory to search for
    progDir = path.resolve(progDir ? progDir : DEFAULT_PROGRAM_DIR);

    /*
			Read the current given program directory, and validate the Solana program lives there
		*/
    let validDir = false;
    try {
      const listing = fs.readdirSync(path.resolve(progDir), {
        withFileTypes: true,
      });

      // verify the `Cargo.toml` file exists
      for (let i = 0; i < listing.length; i++) {
        if (listing[i]?.isFile() && listing[i]?.name === "Cargo.toml")
          validDir = true;
      }
    } catch (err) {}

    if (!validDir)
      return log.error("Unable to locate Solana program directory");

    log.info(`Program directory: ${progDir}`);

    // construct a builder action for the filesystem listener
    const builder = () => {
      const deploySettings = rust.build(progDir, true);

      if (deploySettings) {
        // auto deploy the program
        if (options?.deploy) {
          if (solana.isLocalnet()) {
            // auto airdrop when the balance is low
            solana.airdropOnLowBalance();

            solana.deploy(deploySettings);
          } else {
            // TODO: give the user a quick option to switch to the local cluster as their config
            log.warn("Auto deployments are ONLY allowed using a local cluster");
          }
        }

        return true;
      } else {
        log.error("--------------------------------------");
        log.error("Update and save changes to rebuild");
        log.error("--------------------------------------");
        return false;
      }
    };

    // create the filesystem watcher for the program directory
    const watcher = chokidar.watch(progDir, {
      ignoreInitial: true,
      persistent: true,
    });

    // create the event listeners to listen for desired file changes
    watcher
      .on("add", path => builder())
      .on("change", path => builder())
      .on("unlink", path => builder())
      .on("ready", () => {
        // run the initial build
        const first = builder();

        if (first) log.notice("Listening for changes...");
        else log.notice("Well, your initial build failed...");
      });
  });

module.exports = command;
