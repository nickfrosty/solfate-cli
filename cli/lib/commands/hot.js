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
  // .option("--deploy", "enable auto deployments") // future idea :)
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

    // let ignored = "";
    // construct the file watcher's ignore list (from the `.gitignore`)
    // const gitignore = openAndParseFile(".gitignore");
    // if (gitignore) ignored = new RegExp(gitignore);
    // else

    // ignored = ["", "node_modules", ".dist"];
    // ignored.push(/.*\.(?!rs$|toml$)[^.]+/);
    // generate a regex of the files to be ignored
    // ignored = new RegExp(ignored);
    // ignored = new RegExp(/(^(|[\/\\])\..)|node_modules/);
    // create a regext to ignore NOT (*.rs, *.toml, etc) for Solana program files
    // ignored = new RegExp(/.*\.(?!rs$|toml$)[^.]+/);
    // log.info(ignored);

    // construct a builder action for the listener
    const builder = () => {
      return rust.build(progDir);
    };

    // create the file watcher
    const watcher = chokidar.watch(progDir, {
      ignoreInitial: true,
      ignored: ignored,
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
        else log.notice("Well your initial build failed...");
      });
  });

module.exports = command;
