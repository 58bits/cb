var request = require('supertest')
  , assert = require("assert")
  , assert = require("should")
  , connection = require('../connection.js')
  , app = require('../app.js');


// These are dummy Array tests, placed here so that there is 
// some work to do before connection is called below.
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      [1,2,3].indexOf(5).should.equal(-1);
      [1,2,3].indexOf(0).should.equal(-1);
    });
  });
});

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      [1,2,3].indexOf(5).should.equal(-1);
      [1,2,3].indexOf(0).should.equal(-1);
    });
  });
});

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      [1,2,3].indexOf(5).should.equal(-1);
      [1,2,3].indexOf(0).should.equal(-1);
    });
  });
});


connection(function(err, cb) {
  assert(!err, "connection failure");
  app = app(cb);
  
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


