const axios = require('axios');
const mongoose = require('mongoose');
const Visit = require('../db/models/visit');

module.exports = function(app) {
  /** ----------------------------------------------------------- */
  app.post('/addVisit', (req, res) => {
    console.log('nueva visita');
    var visit = new Visit({
      date: new Date(req.body.date),
      userId: mongoose.Types.ObjectId(req.body.userId),
      placeId: mongoose.Types.ObjectId(req.body.placeId),
      dishes: req.body.dishes
    });
    visit.save(function(err) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        console.log('visita guardada');
        res.json(visit);
      }
    });
  });

  /** ----------------------------------------------------------- */
  app.post('/loadVisits', (req, res) => {
    console.log('cargando visitas..');
    Visit.find({
      placeId: req.body.placeId,
      userId: req.body.userId
    })
      .sort({ date: -1 })
      .exec(function(err, results) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        }
        if (results == null || results.length == 0) {
          console.log('sin resultados');
          res.send([]);
        } else {
          console.log('visitas encontradas:' + results.length);
          res.send(results);
        }
      });
  });
};
