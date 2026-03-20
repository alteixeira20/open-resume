const path = require("path");
const Module = require("module");

process.env.NODE_PATH = path.resolve(__dirname, "../dist/cli/src/app");
Module._initPaths();

require("../dist/cli/scripts/ats-score.js");
