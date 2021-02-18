const router = require("express").Router();
const openDataBase = require("../Tools/dataBaseToolKits/openDataBase");

const collectionName = "rooms";

router.post("/ingest", (request, response) => {
  console.log(request.body);
  openDataBase(process.env.DB_NAME, collectionName).then((db) => {
    db.collection
      .insertOne(request.body)
      .then(() => {
        db.close(); // Close database when done.
        response.send("success");
      });
  });
});

router.get("/:id", async (request, response) => {
  let result = null;
  openDataBase(process.env.DB_NAME, collectionName).then((db) => {
    const query = {
      // Define our database query
      id: Number(request.params.id),
    };

    db.collection
      .find(query) // Retreive records with id
      .toArray()
      .then((data) => {
        console.log(data);
        result = data;
      })
      .then(() => {
        db.close(); // Close database when done.
        response.json(result);
      });
  });
});

router.get(
  "/filter/minimumNights/:minimumNights",
  async (request, response) => {
    let result = null;
    console.log(request.params.minimumNights);
    openDataBase(process.env.DB_NAME, collectionName).then((db) => {
      const query = {
        // Define our database query
        minimum_nights: { $gt: Number(request.params.minimumNights) },
      };

      db.collection
        .find(query) // Retreive records with id
        .toArray()
        .then((data) => {
          console.log(data.length);
          result = data;
        })
        .then(() => {
          db.close(); // Close database when done.
          response.json(result);
        });
    });
  }
);

module.exports = router;
