const MongoClient = require("mongodb").MongoClient;
const openCsvInputStream = require("./openCsvInputStream");
const openMongodbOutputStream = require("./openMongodbOutputStream");

const dbName = "airbnb";

const dbConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const openDataBase = (dbName, collectionName) => {
  return MongoClient.connect(`mongodb+srv://admin:rootbdp2021@bdf-a1-cluster1.padsg.mongodb.net/${dbName}?retryWrites=true&w=majority`, dbConfig).then((client) => {
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

storeDataset('./Data/hosts-stockholm.csv', 'rooms');
//module.exports = storeDataset;
