const papa = require("papaparse");
const fs = require("fs");
const Room = require("../Model/Room");
const Review = require("../Model/Review");

module.exports = async (datasetPath, datasetName) => {
    papa.parse(fs.ReadStream(datasetPath), {
      header: true,
      complete: (results) => {
        try {
          const hostRecords = results.data;
          if (datasetName === 'hosts') {
            Room.insertMany(hostRecords).then(() => {
                console.log("success in reading and inserting hosts");
              });
          } else {
            Review.insertMany(hostRecords).then(() => {
                console.log("success in reading and inserting reviews");
              });
          }
          
        } catch (err) {
          console.log(err);
        }
      },
    });
  };