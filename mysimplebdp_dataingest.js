const parseArgs = require('./Tools/parseArgs');
const dataIngest = require('./Tools/dataIngest');
const dotenv = require("dotenv");

//Import env
dotenv.config();

//tools for parsing args and store into DB
const [datasetPath, datasetName] = parseArgs();
//example: node mysimplebdp_dataingest.js --dataset calendars
dataIngest(datasetPath, datasetName);