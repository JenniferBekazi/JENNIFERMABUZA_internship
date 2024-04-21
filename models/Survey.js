const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  favoriteFoods: [String],
  ratings: { type: Number, required: true },
  ratingsMovie: [String],
  ratingsTV: [String],
  ratingsRadio:[String],
  ratingsEatOut:[String]
});

module.exports = mongoose.model('Survey', surveySchema);
