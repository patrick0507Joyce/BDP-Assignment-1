const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  listing_id: {
    type: Number,
  },
  id: {
    type: Number,
  },
  date: {
    type: Date,
  },
  reviewer_id: {
    type: Number,
  },
  reviewer_name: {
    type: String,
  },
  comments: {
    type: String,
  },
});

reviewSchema.index({ reviewer_id: 1 });

module.exports = mongoose.model("Review", reviewSchema);
