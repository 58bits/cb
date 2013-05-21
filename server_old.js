var driver = require('couchbase'),
  appVersion = require('./version.js').appVersion();

dbConfiguration = {
  "hosts": ["localhost:8091"],
  "bucket": "photos"
};

driver.connect(dbConfiguration, function(err, cb) {
  if (err) {
    throw (err);
  }

  // Initialize the CouchBase Design Document if there isn't one, or if the
  // version number has been bumped.
  require('./init.js').init(cb, appVersion);

  // Initialize express, routes, and the API.
  var api = require('./api.js')(cb);
  var app = require('./app.js');
  require('./routes.js')(app, api);

  var appServer = app.listen(3000, function() {
    console.log("Express server listening on port %d in %s mode", appServer.address().port, app.settings.env);
  });
});
