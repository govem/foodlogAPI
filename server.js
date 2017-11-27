const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const config = require('./db/config');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(config.port, () => {
  mongoose.Promise = global.Promise;
  mongoose.connect(config.db.uri, { useMongoClient: true });

  const db = mongoose.connection;

  db.on('error', err => {
    console.error(err);
    process.exit(1);
  });

  db.once('open', () => {
    require('./routes/placesRoutes')(app);
    require('./routes/userRoutes')(app);
    console.log(`Server is listening on port ${config.port}`);
  });
});
