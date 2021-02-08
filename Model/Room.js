const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
  },
  host_id: {
    type: Number,
  },
  neighbourhood_group: {
    type: String,
  },
  neighbourhood: {
    type: String,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  room_type: {
    type: String,
  },
  price: {
    type: Number,
  },
  minimum_nights: {
    type: Number,
  },
  number_of_reviews: {
    type: Number,
  },
  last_review: {
    type: Date,
  },
  reviews_per_month: {
    type: Number,
  },
  calculated_host_listings_count: {
    type: Number,
  },
  availability_365: {
    type: Number,
  },
});

module.exports = mongoose.model("Room", roomSchema);
