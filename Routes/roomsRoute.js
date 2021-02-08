const router = require("express").Router();
const Room = require("../Model/Room");

router.post('/ingest', (request, response) => {
  console.log(request.body);
  Room.create(request.body);
})

router.get("/:id", async (request, response) => {
  console.log(request.params.id);
  const hostRecord = await Room.find({ id: request.params.id }).exec();
  console.log(hostRecord);
});

router.get('/filter/roomType/:roomType',async (request, response) => {
  console.log(request.params.roomType);
  const roomRecords = await Room.find({ room_type: request.params.roomType }).exec();
  console.log(roomRecords);
})

router.get('/filter/minimumNights/:minimumNights',async (request, response) => {
  const roomRecords = await Room.find({ minimum_nights: {$lt: request.params.minimumNights} }).exec();
  console.log(roomRecords.length);
})


module.exports = router;
