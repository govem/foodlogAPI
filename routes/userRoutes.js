const User = require('../db/models/user');

module.exports = function(app) {
  /** ----------------------------------------------------------- */
  app.post('/login', (req, res) => {
    User.findOne({ fbid: req.body.user.fbid }, function(err, doc) {
      if (err) {
        console.error(err);
        //TODO manejar error hacia afuera
      } else if (doc == null) {
        //usuario no existe en bd, se crea
        console.log(req.body.user);
        let user = new User(req.body.user);
        user.save(function(err) {
          if (err) {
            console.error(err);
            //TODO manejar error
          } else {
            res.send(user);
          }
        });
      } else {
        //usuario existe, se devuelve
        res.send(doc);
        //TODO registrar login tambien?
      }
    });
  });
};
