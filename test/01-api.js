var request = require('supertest')
  , assert = require("should")
  , connection = require('../connection.js')
  , application = require('../app.js')
  , app;

describe("API", function() { 

  before(function(done) {
    var connected = connection.connect();
    connected.then(function (cb) {
    app = application.init(cb);
    done();
    }, function (err) {
      console.log("There was an error connecting to the database: " + err);
      done();
    });
  });

  describe('GET /api/users', function(){
    it('respond with json', function(done){
      request(app)
        .get('/api/users')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});