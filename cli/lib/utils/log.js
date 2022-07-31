/**
 * Common logging for the console
 */

const chalk = require("chalk");

const BASE = "[SOLFATE]";

const base = chalk.yellow(BASE);

const info = msg => {
  console.log(base, chalk.white(msg));
};

const notice = msg => {
  console.log(base, chalk.blue(msg));
};

const warn = msg => {
  console.log(base, chalk.yellow(msg));
  return false;
};

const success = msg => {
  console.log(base, chalk.green(msg));
};

const error = msg => {
  console.log(base, chalk.red(msg));
  return false;
};

module.exports = {
  info,
  notice,
  success,
  warn,
  error,
};
