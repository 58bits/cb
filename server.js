//Require the 'ready to go' application object.
var connection = require('./connection.js')
  , app = require('./app.js');

connection(function(err, cb) {
  app = app(cb);
  var appServer = app.listen(3000, function() {
    console.log("Express server listening on port %d in %s mode", appServer.address().port, app.settings.env);
  });
});