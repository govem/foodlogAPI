const Place = require('../db/models/places');
const User = require('../db/models/user');
const axios = require('axios');
const mongoose = require('mongoose');

const GOOGLE_PLACES_API_KEY = 'AIzaSyBDBcbEvQb1xcCldL-KV8lcT7Qsjxjn-8c';
const GOOGLE_PLACES_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
const GOOGLE_PLACES_PHOTO = 'https://maps.googleapis.com/maps/api/place/photo?';

module.exports = function(app) {
  /** ----------------------------------------------------------- */
  app.get('/searchPlace', (req, res) => {
    var location = encodeURIComponent(req.query.location);
    var radius = 50000;
    var types = 'restaurant';
    var keyword = req.query.search;

    console.log('buscando lugares desde google');
    var url =
      GOOGLE_PLACES_URL +
      'key=' +
      GOOGLE_PLACES_API_KEY +
      '&location=' +
      location +
      '&radius=' +
      radius +
      '&types=' +
      types +
      '&keyword=' +
      keyword;
    axios
      .get(url)
      .then(response => {
        console.log('lugares google encontrados:' + response.data.results.length);
        var objectid = mongoose.Types.ObjectId(req.query.userid);
        console.log('buscando usuario');
        User.findById(objectid, function(err, userfound) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          }
          if (userfound == null) {
            console.log(err);
            res.sendStatus(500);
          } else {
            console.log('usuario encontrado, cruzando lugares');
            var lugaresusuario = [];
            lugaresusuario = lugaresusuario.concat(userfound.visited);
            lugaresusuario = lugaresusuario.concat(userfound.notvisited);
            console.log('lugares de usuario: ' + lugaresusuario.length);
            var salida = [];
            for (var i = 0; i < response.data.results.length; i++) {
              var place = response.data.results[i];
              for (var j = 0; j < lugaresusuario.length; j++) {
                if (place.id === lugaresusuario[j].googleid) {
                  place.exists = true;
                  break;
                }
              }
              salida.push(place);
            }
            //console.log('salida enviada:' + JSON.stringify(salida));
            res.json(salida);
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  /** ----------------------------------------------------------- */
  app.get('/getPlacePhoto', (req, res) => {
    var height = req.query.height;
    var ref = req.query.reference;
    var url = GOOGLE_PLACES_PHOTO + 'key=' + GOOGLE_PLACES_API_KEY + '&photo_reference=' + ref + '&maxheight=' + height;
    axios
      .get(url, {
        responseType: 'arraybuffer'
      })
      .then(response => {
        var img = new Buffer(response.data, 'binary');
        res.writeHead(200, {
          'Content-Type': 'image/png',
          'Content-Length': img.length
        });
        res.end(img);
      })
      .catch(err => {
        console.log(err);
        res.status(500).send();
      });
  });

  /** ----------------------------------------------------------- */
  app.post('/addPlace', (req, res, next) => {
    let data = req.body.place || {};
    console.log('agregando lugar con id: ' + data.id);
    Place.findOne({ id: data.id }, function(err, foundplace) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      }
      console.log('lugar encontrado:' + JSON.stringify(foundplace));
      if (foundplace != null) {
        associatePlaceWithUser(req.body.user._id, foundplace, res);
      } else {
        console.log('lugar nuevo, guardando');
        let place = new Place(data);
        //guarda el lugar en la tabla de lugares
        place.save(function(err, foundplace) {
          if (err) {
            console.error(err);
            res.sendStatus(500);
          }
          console.log('lugar guardado');
          associatePlaceWithUser(req.body.user._id, foundplace, res);
        });
      }
    });
  });

  /** ----------------------------------------------------------- */
  app.get('/places/:userobjectid/:visited', (req, res) => {
    console.log('buscando lugares de usuario: ' + req.params.userobjectid);
    var objectid = mongoose.Types.ObjectId(req.params.userobjectid);
    console.log(req.params.visited);
    var pop = req.params.visited == 'visited' ? 'visited._id' : 'notvisited._id';
    User.findById(objectid)
      .populate(pop)
      .exec(function(err, userfound) {
        if (err) {
          console.error(err);
          res.sendStatus(500);
        }
        if (userfound == null) {
          console.log('usuario no encontrado, no debiera pasar');
        } else {
          if (req.params.visited == 'visited') {
            console.log(userfound.visited.length + ' lugares encontrados');
            res.send(preparePlaces(userfound.visited));
          } else {
            console.log(userfound.notvisited.length + ' lugares encontrados');
            res.send(preparePlaces(userfound.notvisited));
          }
        }
      });
  });
};

function preparePlaces(places) {
  var salida = [];
  for (var i = 0; i < places.length; i++) {
    salida.push(places[i]._id);
  }
  return salida;
}

//guarda la relacion del lugar con el usuario
function associatePlaceWithUser(id, place, res) {
  var objectid = mongoose.Types.ObjectId(id);
  console.log('buscando usuario');
  User.findById(objectid, function(err, user) {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      if (user == null) {
        console.log('Usuario no existe. No debería pasar');
        res.sendStatus(400);
      } else {
        var notvisited = user.notvisited;
        notvisited.push({ _id: place._id, googleid: place.id });
        console.log('asociando lugar a usuario');
        user.save(function(err) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            console.log('lugar asociado a usuario');
            res.sendStatus(200);
          }
        });
      }
    }
  });
}
