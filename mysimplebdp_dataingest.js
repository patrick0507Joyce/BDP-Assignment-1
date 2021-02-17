const parseArgs = require('./Tools/parseArgs');
const dataIngest = require('./Tools/dataIngest');
const dotenv = require("dotenv");

//Import env
dotenv.config();

//tools for parsing args and store into DB
const [datasetPath, datasetName] = parseArgs();
dataIngest(datasetPath, datasetName);