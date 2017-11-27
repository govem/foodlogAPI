const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');

const UserSchema = new mongoose.Schema({
  fbid: String,
  name: String,
  lastname: String,
  email: String,
  gender: String,
  picture: {
    data: {
      height: Number,
      url: String,
      width: Number
    }
  },
  visited: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
      googleid: String
    }
  ],
  notvisited: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
      googleid: String
    }
  ],
  favorites: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
      googleid: String
    }
  ]
});

UserSchema.plugin(timestamps);
UserSchema.plugin(mongooseStringQuery);

const User = mongoose.model('User', UserSchema);
module.exports = User;

/*
fbid: '123123121',
      name: 'nombre',
      lastname: 'asdasd',
      email: 'asdasdas',
      gender: 'asdas',
      visited: {
        placeid1: true,
        placeidN: true
      },
      notvisited: {
        placeidx: true
      },
      favorites: {
        placeid1: true,
        placeid2: true
      }*/
