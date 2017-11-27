const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');

const PlaceSchema = new mongoose.Schema({
  geometry: {
    location: {
      lat: Number,
      lng: Number
    },
    viewport: {
      northeast: {
        lat: Number,
        lng: Number
      },
      southwest: {
        lat: Number,
        lng: Number
      }
    }
  },
  icon: String,
  id: String,
  name: String,
  opening_hour: {
    open_now: Boolean,
    weekday_text: Array
  },
  photos: [
    {
      height: Number,
      html_attributions: Array,
      photo_reference: String,
      width: Number
    }
  ],
  place_id: String,
  rating: Number,
  reference: String,
  scope: String,
  types: Array,
  vicinity: String
});

PlaceSchema.plugin(timestamps);
PlaceSchema.plugin(mongooseStringQuery);

const Place = mongoose.model('Place', PlaceSchema);
module.exports = Place;
