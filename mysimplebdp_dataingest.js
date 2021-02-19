const parseArgs = require('./Tools/parseArgs');
const dataIngest = require('./Tools/dataIngest');
const dotenv = require("dotenv");
const Stopwatch = require('statman-stopwatch');

//Import env
dotenv.config();

//create the timeWatch
const stopwatch = new Stopwatch();

//tools for parsing args and store into DB
const [datasetPath, datasetName] = parseArgs();
//example: node mysimplebdp_dataingest.js --dataset calendars
stopwatch.start();
const callback = (err) => {
    if (err) {
        console.log("error on the way", err);
    }
    console.log(stopwatch.read() / 1000, " sec");
}
dataIngest(datasetPath, datasetName, callback);
