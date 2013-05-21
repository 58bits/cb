//Initialize the Couchbase driver.
var driver = require('couchbase')
  , appVersion = require('./version.js').appVersion;
  , dbConfiguration = {
      "hosts": ["localhost:8091"],
      "bucket": "test"
    };

module.exports = function(callback) {
  driver.connect(dbConfiguration, function(err, cb) {
    if (err) {
      throw (err);
    }
    // Initialize the Couchbase design document and seed documents if required.
    require('./init_db.js').init(cb, appVersion);

    //Call the caller's callback, which will keep the connection open as long as required.
    callback(err, cb);
  });
};