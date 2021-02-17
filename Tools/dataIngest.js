const MongoClient = require("mongodb").MongoClient;
const openCsvInputStream = require("./streamToolKits/openCsvInputStream");
const openMongodbOutputStream = require("./streamToolKits/openMongodbOutputStream");

const dbName = "airbnb";

const dbConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const openDataBase = (dbName, collectionName) => {
  return MongoClient.connect(process.env.DB_CONNECT, dbConfig).then((client) => {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    return {
      collection: collection,
      close: () => {
        return client.close();
      },
    };
  });
};

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
  openDataBase(dbName, collectionName)
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
