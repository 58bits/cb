module.exports.init = function(cb) {
  // Initialize express, the api and routes.
  var express = require('express')
  , app = express();

  app.configure(function() {
      app.set('views', __dirname + '/views');
      app.engine('.html', require('ejs').renderFile);
      app.set('view engine', 'html');
      app.set('view options', {
        layout: false
      });
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(express.cookieParser());
      app.use(express.session({
        secret: 'photos-x'
      }));
      app.use(app.router);
      app.use(express.static(__dirname + '/public'));
    });


  //Setup the api - with the open CouchBase connection.
  var api = require('./api.js')(cb);

  //Initialize routes with app and api handlers.
  require('./routes.js')(app, api);

  return app;
};