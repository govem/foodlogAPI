const axios = require('axios');
const mongoose = require('mongoose');
const Visit = require('../db/models/visit');

module.exports = function(app) {
  /** ----------------------------------------------------------- */
  app.post('/addVisit', (req, res) => {
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
        res.json(visit);
      }
    });
	});
	
	/** ----------------------------------------------------------- */
	app.post('/loadVisits', (req, res) => {
		
	});
};
