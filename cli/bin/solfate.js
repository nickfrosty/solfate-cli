#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();

/*
	Set the basic command meta data
*/
program
  .name("solfate")
  .description("Developer tool for building Solana programs")
  .version("0.1.0");

/*
    Add each of the commands to the CLI program
*/

// program.addCommand(require("../lib/commands/build"));

// program.addCommand(require("../lib/commands/deploy"));

program.addCommand(require("../lib/commands/hot"));

/*
	Start accepting commands for the CLI
*/

program.parse();
