exports.init = function (cb, appVersion) {
  cb.get("app.version", function(err, doc, meta) {
    if (!doc || doc.version != appVersion) {
      initViews(cb, appVersion);
      if (!doc) {
        seedDocuments(cb);
      }
    }
  });
};

/**
 * Initialize couchbase views.
 *
 * @param {Bucket} cb
 * @param {String} appVersion
 * @api private
 */

function initViews(cb, appVersion) {
  console.log("Installing views for application version "+ appVersion);

  var ddoc = {
    "views": {
      "users": {
        "map": "function (doc, meta) { \n"
        +"  if (doc.type == \"user\") { \n"
        +"    emit(doc.name); \n"
        +"  }\n"
        +"}\n"
      },
      "user_by_email": {
        "map": "function (doc, meta) { \n"
        +"  if (doc.type == \"user\") { \n"
        +"    emit(doc.email); \n"
        +"  }\n"
        +"}\n"
      },
      "collection_by_url": {
        "map": "function (doc, meta) { \n"
        +"  if (doc.type == \"collection\") { \n"
        +"    emit(doc.url); \n"
        +"  }\n"
        +"}\n"
      },
      "collection_by_user_id": {
        "map": "function (doc, meta) { \n"
        +"  if (doc.type == \"collection\") { \n"
        +"    emit(doc.user_id, [doc.title, doc.url]); \n"
        +"  }\n"
        +"}\n"
      }
    }
  };

  cb.setDesignDoc('test', ddoc, function(err, resp, data) {
    if (err) {
      console.log(err);
    } else {
      cb.set("app.version",{"type" : "AppVersion", "version" : appVersion}, function(err, meta) {});
    }
  });
}

/**
 * Seed couchbase documents
 *
 * @param {Bucket} cb
 * @api private
 */
 
function seedDocuments(cb){
  console.log("Seeding bucket with documents.");
  model = require('./model.js');
  model.documents.forEach(function(item) {
    cb.set(item.id, item, function(err, meta) {});
  });
  console.log("Ready and listening.");
}
