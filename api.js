module.exports = function(cb) {

/**
 * Default response on /
 *
 * @param {Request} req
 * @param {Response} res
 * @api public
 */

  function root(req, res) {
    res.send("Hello");
  }

 /**
 * List users
 * TODO: implement paging with skip.
 *
 * @param {Request} req
 * @param {Response} res
 * @api public
 */

function users(req, res) {
  cb.view("test", "users",
  {
    stale: false
  },
  function(err, view) {
    var keys = [];
    for (var i = 0; i < view.length; i++) {
      keys.push(view[i].id);
    }
    cb.get(keys, null, function(errs, docs, metas) {
      res.send(docs);
    });
  });
}

/**
 * Find a user by email address
 *
 * @param {Request} req
 * @param {Response} res
 * @api public
 */

function user_by_email(req, res) {
  if (req.params.email != null) {
    cb.view("test", "user_by_email",
    {
      stale: false,
      key: req.params.email
    },
    function(err, view) {
      if (err) {
        console.log(err);
        res.send(500);
      } else {
        if (view.length == 1) {
          var key = view[0].id;
          get(req, res, key, "user");
        } else {
          res.send(404);
        }
      }
    });
  } else {
    res.send(404);
  }
}


/**
 * Find all collections for a user.
 *
 * @param {Request} req
 * @param {Response} res
 * @api public
 */

function collections_by_user(req, res) {
  if (req.params.user_id != null) {
    cb.view("test", "collection_by_user_id",
    {
      stale: false,
      key: req.params.user_id
    },
    function(err, view) {
      var keys = [];
      for (var i = 0; i < view.length; i++) {
        keys.push(view[i].id);
      }
      cb.get(keys, null, function(errs, docs, metas) {
        res.send(docs);
      });
    });

    } else {
    res.send(404);
  }
}

/**
 * Find a collection by url.
 *
 * @param {Request} req
 * @param {Response} res
 * @api public
 */

function collection_by_url(req, res) {
  if (req.params.url != null) {
    cb.view("test", "collection_by_url",
    {
      stale: false,
      key: req.params.url
    },
    function(err, view) {
      if (err) {
        console.log(err);
        res.send(500);
      } else {
        if (view.length == 1) {
          var id = view[0].id;
          get(req, res, id, "collection");
        } else {
          res.send(404);
        }
      }
    });
  } else {
    res.send(404);
  }
}

/**
 * Couchbase helpers
 */

function get(req, res, id, docType) {
  cb.get(id, function(err, doc, meta) {
    if (doc != null && doc.type) {
      if (doc.type == docType) {
        res.send(doc);
      } else {
        res.send(404);
      }
    } else {
      res.send(404);
    }
  });
}

function upsert(req, res, docType) {
  // check if the body contains a know type, if not error
  if (req.body != null && req.body.type == docType) {
    var id = req.body.id;
    if (id == null) {
    // increment the sequence and save the doc
      if ( docType != "vote" ) {
        cb.incr("counter:"+req.body.type, function(err, value, meta) {
          id = req.body.type + ":" + value;
          req.body.id = id;
          cb.set(id, req.body, function(err, meta) {
            res.send(200);
          });
        });
      } else {
        id = req.body.type + ":" + req.body.user_id +"-"+ req.body.idea_id;
        req.body.id = id;
        cb.set(id, req.body, function(err, meta) {
          var endureOpts = {
            persisted: 1,
            replicated: 0
          };
          cb.endure(id, endureOpts, function(err, meta) {
            res.send(200);
          });
        });
      }

    } else {
      cb.set(id, req.body, function(err, meta) {
        res.send(200);
      });
    }
  } else {
    res.send(403);
  }
}

/**
 * Return our api object.
 */

return {
  root: root,
  users: users,
  user_by_email: user_by_email,
  collections_by_user: collections_by_user,
  collection_by_url: collection_by_url
};
};