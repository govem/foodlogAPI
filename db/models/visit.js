const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');
const Dish = require('./dish');

const dishSchema = Dish();
const VisitSchema = new mongoose.Schema({
  date: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
  dishes: [
    {
      name: String,
      price: Number,
      value: Number
    }
  ]
});

VisitSchema.plugin(timestamps);
VisitSchema.plugin(mongooseStringQuery);

const Visit = mongoose.model('Visit', VisitSchema);
module.exports = Visit;
