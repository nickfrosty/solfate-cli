/**
 * Assorted useful utility functions
 */

const fs = require("fs");
const path = require("path");
const log = require("./log");

/**
 * Resolve and load the `solfate.config.js` file from the local directory tree or project
 * @returns `object` of the user user defined configs, or an empty `object` on any error
 */
const loadSolfateConfig = () => {
  const FILE_NAME = "solfate.config.js";

  // attempt the resolve the config file in the local project structure
  const filePath = resolveNearestFile(FILE_NAME, false);
  if (!filePath) throw Error("file not found");

  // attempt to load the config file
  try {
    const SolfateConfig = require(filePath);
    if (typeof SolfateConfig === "object") return SolfateConfig;
  } catch (err) {
    // do nothing
    log.warn(`Invalid solfate config file: ${filePath}`);
  }

  // always returns an object, even when errors occur
  return {};
};

/**
 *
 * @param {string} filePath local file path to read in and parse (this will auto resolve)
 * @returns {boolean} `false` when unsuccessful, or
 * @returns {string} the string contents of the file
 */
const openFile = filePath => {
  try {
    filePath = path.resolve(filePath);
    if (fs.existsSync(filePath)) return fs.readFileSync(filePath, "utf-8");
  } catch (err) {
    // do nothing
  }
  return false;
};

/**
 * Read and parse the given file located `filePath`
 * @param {string} filePath local file path to read in and parse (this will auto resolve)
 * @param {string} type the type of file to load
 * 		- `json` - parse as JSON and returns and object
 * 		- `lines` - array of the non-empty lines
 * @returns {boolean} `false` when unsuccessful, or
 * @returns {various} the parsed file contents determined by the `type`
 */
const openAndParseFile = (filePath, type = null) => {
  let file = openFile(filePath);
  if (!file) return false;

  // establish an auto-parsing mechanism, when type is not specified
  if (!type) {
    if (filePath.endsWith(".json")) type = "json";
    else if (
      filePath
        ?.split(path.sep)
        [filePath?.split(path.sep)?.length - 1]?.startsWith(".")
    )
      type = "lines";
  }

  // parse the accepted `types`
  switch (type) {
    case "lines":
      file = file.split("\n");
      file = file.filter(line => line && line);
      break;
    case "json":
      file = JSON.parse(file);
      break;
    case "string": /* do nothing */
    default:
      break;
  }

  return file;
};

/**
 * Determine the nearest absolute path of the given file/folder name
 * @param {string} name file or folder name to locate
 * @param {boolean} caseSensitive
 * @returns `string` of the resolved path to the provided `name` or `false` when not found
 */
const resolveNearestFile = (name, caseSensitive = false) => {
  if (!name) return false;
  if (!caseSensitive) name = name.toLowerCase();

  // set a max crawl depth to prevent searching the whole OS
  // NOTE: 5 should be enough to cover being in any directory, even in a mono repo
  const MAX_CRAWL_DEPTH = 5;

  let current_depth = 0;
  let cwd = process.cwd();
  let foundPath = false;

  // begin crawling for the `name`
  while (!foundPath && current_depth <= MAX_CRAWL_DEPTH) {
    try {
      if (fs.existsSync(path.resolve(cwd, name)))
        foundPath = path.resolve(cwd, name);
    } catch (err) {
      // no nothing
    }

    // when the current dir has a `.git` directory,
    // consider that the project root and stop searching
    if (fs.existsSync(path.resolve(cwd, ".git/"))) return false;

    // update the crawl counter and move up one directory level
    current_depth++;
    cwd = path.resolve(cwd, "..");
  }

  return foundPath;
};

module.exports = {
  openFile,
  openAndParseFile,
  resolveNearestFile,
  loadSolfateConfig,
};
