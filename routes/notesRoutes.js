const axios = require('axios');
const mongoose = require('mongoose');
const Note = require('../db/models/note');

module.exports = function(app) {
  /** ----------------------------------------------------------- */
  app.post('/note', (req, res) => {
    console.log('nueva nota');
    var note = new Note({
      userId: mongoose.Types.ObjectId(req.body.userId),
      placeId: mongoose.Types.ObjectId(req.body.placeId),
      text: req.body.text
    });
    note.save(function(err) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        console.log('nota guardada');
        res.json(note);
      }
    });
  });

  /** ----------------------------------------------------------- */
  app.get('/note/:userid/:placeid', (req, res) => {
    console.log('cargando notas');
    Note.find({
      placeId: req.params.placeid,
      userId: req.params.userid
    })
      .sort({ createdAt: -1 })
      .exec(function(err, results) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        }
        if (results == null || results.length == 0) {
          console.log('sin resultados');
          res.send([]);
        } else {
          console.log('notas encontradas: ' + results.length);
          res.send(results);
        }
      });
  });
};
