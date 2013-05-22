//Initialize the Couchbase driver.
var driver = require('couchbase')
  , Q = require('q')
  , appVersion = require('./version.js').appVersion
  , dbConfiguration = {
      "hosts": ["localhost:8091"],
      "bucket": "test"
    };

module.exports.connect = function() {
  var deferred = Q.defer();
  driver.connect(dbConfiguration, function(err, cb) {
    if (err) {
      deferred.reject(new Error(err));
    } else {
      deferred.resolve(cb);
    }
    // Initialize the Couchbase design document and seed documents if required.
    require('./init_db.js').init(cb, appVersion);
  });

  return deferred.promise;
};