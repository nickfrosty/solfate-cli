/**
 * Assorted useful utility functions
 */

const fs = require("fs");
const path = require("path");

/**
 *
 * @param {string} filePath local file path to read in and parse (this will auto resolve)
 * @returns {boolean} `false` when unsuccessful, or
 * @returns {string} the string contents of the file
 */
const loadFile = (filePath) => {
  filePath = path.resolve(filePath);
  if (fs.existsSync(filePath)) return fs.readFileSync(filePath, "utf-8");
  else return false;
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
const loadAndParseFile = (filePath, type = null) => {
  let file = loadFile(filePath);

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
      file = file.filter((line) => line && line);
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

// WIP for the future
const locateNearestFileByName = (name, caseSensitive = false) => {
  if (!name) return false;
  if (!caseSensitive) name = name.toLowerCase();

  const baseDir = ".";
  const stack = [];

  let nearest = false;

  let cwd = baseDir;

  // while (!nearest){

  // }

  const listing = fs.readdirSync(path.resolve(baseDir), {
    withFileTypes: true,
  });

  console.log(listing);

  // crawl the search directory for more files
  for (let i = 0; i < listing.length; i++) {
    const pointer = path.join(baseDir, listing[i]?.name);
    // console.log(pointer);

    // recursively crawl child directories
    if (listing[i].isDirectory()) stack.push(pointer);
    // files.push(...crawlForFiles(pointer, autoParseFile));
    else if (listing[i].isFile()) {
      // lower case the file name when needed
      if (!caseSensitive)
        listing[i] = listing[i]?.name?.toLowerCase() || listing[i];

      console.log(listing[i]);
      // TODO: add checking to only search for the given file extensions

      // when desired, ready and parse the files contents
      // if (autoParseFile) {
      // 	const item = parseFile(pointer);

      // 	// add the files parsed 'item' to the array (but NOT drafts unless explictly wanted)
      // 	if (drafts === true || item?.meta?.draft !== false)
      // 		files.push(item);
      // } else
      // files.push(pointer);
    }
  }

  return name;
};

module.exports = {
  loadFile,
  loadAndParseFile,
  locateNearestFileByName,
};
