//Require the 'ready to go' application object.
var connection = require('./connection.js')
  , application = require('./app.js');


var connected = connection.connect();

connected.then(function (cb) {
    app = application.init(cb);
    var appServer = app.listen(3000, function() {
      console.log("Express server listening on port %d in %s mode", appServer.address().port, app.settings.env);
    });

}, function (err) {
  console.log("There was an error connecting to the database: " + err);
});