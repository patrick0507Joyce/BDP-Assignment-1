const openCsvInputStream = require("./streamToolKits/openCsvInputStream");
const openMongodbOutputStream = require("./streamToolKits/openMongodbOutputStream");
const openDataBase = require("./dataBaseToolKits/openDataBase");

const streamData = (inputFilePath, dbCollectionName) => {
  return new Promise((resolve, reject) => {
    openCsvInputStream(inputFilePath)
      .pipe(openMongodbOutputStream(dbCollectionName))
      .on("finish", () => {
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

const storeDataset = (inputFilePath, collectionName) => {
  openDataBase(process.env.DB_NAME, collectionName)
    .then(client => {
      return streamData(inputFilePath, client.collection).then(() =>
        client.close()
      );
    })
    .then(() => {
      console.log("store into db successfully");
    })
    .catch((err) => {
      console.log("error info", err);
    });
};

module.exports = storeDataset;
