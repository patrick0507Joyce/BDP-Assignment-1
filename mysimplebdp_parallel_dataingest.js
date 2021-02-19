const yargs = require("yargs/yargs");
const spawn = require('child_process').spawn;
const parallel = require('async-await-parallel');
const Stopwatch = require('statman-stopwatch');


// run slave
const runSlave = async (slaveIndex) => {
    return new Promise((resolve, reject) => {
        const args = [ 'mysimplebdp_dataingest.js', '--dataset', ' calendars' ];
        const childProcess = spawn("node", args);

        childProcess.stdout.on("data", data => {
            console.log("[" + slaveIndex + "]: INF: " + data);
        });

        childProcess.stderr.on("data", data => {
            console.log("[" + slaveIndex + "]: ERR: " + data);
        });

        childProcess.on("close", code => {
            if (code === 0) {
                resolve();
            }
            else {
                reject(code);
            }
        });

        childProcess.on("error", err => {
            reject(err);
        });  
    })
}
//create the timeWatch
const stopwatch = new Stopwatch();
//example: node mysimplebdp_parallel_dataingest.js --slaveCount 20
const argv = yargs(process.argv.slice(2)).argv;
const slaveCount = argv.slaveCount;

let slaveProcess = [];
for (let index = 0; index < slaveCount; index++) {
    slaveProcess.push(runSlave(index));
}

stopwatch.start();
Promise.all(slaveProcess)
.then(() => {
    console.log("all the processes finish in:", stopwatch.read() / 1000, " sec");
})
.catch(err => {
    console.log(err);
});
