const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');

const DishSchema = new mongoose.Schema({
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
  name: String,
  price: Number
});

DishSchema.plugin(timestamps);
DishSchema.plugin(mongooseStringQuery);

const Visit = mongoose.model('Dish', DishSchema);
module.exports = Visit;
