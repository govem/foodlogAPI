const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');

const NoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
  text: String,
  imageUrl: String
});

NoteSchema.plugin(timestamps);
NoteSchema.plugin(mongooseStringQuery);

const Note = mongoose.model('Note', NoteSchema);
module.exports = Note;
