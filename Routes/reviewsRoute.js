const router = require("express").Router();

router.post('/ingest', (request, response) => {
    console.log(request.body);
    Review.create(request.body);
})

router.get('/filter/listingId/:listingId',async (request, response) => {
    const reviewRecords = await Review.find({ listing_id: request.params.listingId }).exec();
    console.log(reviewRecords);
    response.send(reviewRecords);
  })

module.exports = router;
