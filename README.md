Node.js and Couchbase
====================

An experimental RESTful API built with node.js, express and couchbase.

Installation
------------

Assumes you have node.js and npm installed (for Mac OS X - `brew install node`).

Download and install [Couchbase](http://www.couchbase.com/download). There is an excellent and super easy installer for Mac OS X. 

Clone this repository `git clone https://github.com/58bits/cb.git`

Create a bucket called `test` using the admin interface (assuming you have Couchbase installed and running). Or create a bucket using whatever name you like, and update 'connection.js' to point to that bucket instead.

From inside the cloned git repository...

`npm install`

... will install all the required npm modules locally under 'node_modules'.

`make test` - will run the tests.

`node server.js` - will start the express server on `http://localhost:3000`

The first time either the tests, or the node server is run on a new bucket, the design document for views, and test documents will automatically be loaded into the bucket. Thanks [@tgrall](https://github.com/tgrall/couchbase-node-ideas).

If everything is working you should see a list of two users on `http://localhost:3000/api/users`


Testing with Mocha and Supertest
--------------------------------

Now let's say we'd like to create a set of middleware integration tests for our RESTful API.

This could be done by starting the express/node.js server, and then using any HTTP lib (curl even) to call the api, and test for the expected results.

I wanted to use [Mocha](https://github.com/visionmedia/mocha) and [Supertest](https://github.com/visionmedia/supertest) and take advantage of Mocha's support for express, and not create a separate server process just to run tests. If our application has all if its require(ments) (including all routes, handlers and a connection to the database), an 'ephemeral' port will be created, and we can call all of the route methods (get, post, put, delete) for the express application in our test fixtures.

At this point it's worth describing how we connect to Couchbase, and what that's going to mean for our test fixtures.

To create a connection to Couchbase, we call the driver's `driver.connect` method, passing in a callback with the following signature: `function(err, cb){...}`. The use of a callback makes this an asynchronous call (with our callback placed on the queue of the Node.js event loop), and so we won't know exactly when `function(err, cb){...}` is going to be called.

The excellent sample app, [Easy application development with Couchbase, Angular and Node.js](http://www.javacodegeeks.com/2013/03/easy-application-development-with-couchbase-angular-and-node-js.html) written by Tugdual Grall [@tgrall](https://github.com/tgrall), suggests placing `appServer = app.listen(3000, function() {...}` (and whatever application initialization code we need) inside the callback we send to `driver.connect`. 

However, `driver.connect` is going to force us to wrap the entire test suite in the `function(err, cb){...}` callback, unless we can determine when the callback has completed.

It was at this point I feel down the callback rabbit hole.

Fortunately mocha has a little helper method called `done()` that we can include in a callback, to tell the test fixture or `before` method that we're done, and ready.

If we don't mind including the Couchbase driver in our test setup, then we could probably do something like this (warning - not tested):

	var request = require('supertest')
		, assert = require("assert")
		, assert = require("should")
		, driver = require('couchbase')
		, application = require('../app.js')
		, app;

	var dbConfiguration = {
      "hosts": ["localhost:8091"],
      "bucket": "test"
    };

	describe("API", function() { 
		before(function(done) {
		    driver.connect(dbConfiguration, function(err, cb) {
			    if (err) {
			      console.log("There was an error connecting to the database: " + err);
			      done();
			    } else {
			      app = application.init(cb);
			      done();
			    }
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


Remember though, that I was down the callback rabbit hole (for quite a while as it happens), reading about [async control flow patterns](http://book.mixu.net/ch7.html) and such, including something called 'promises'. 

I also wanted to abstract away the Coubchase database connection details.

And so I created `connection.js` as a generic way to open a connection to Couchbase (or any other database) using a promise with [Kris Kowal's Q framework](https://github.com/kriskowal/q).

The results are in the repo.

If you've made it this far, and your node.js and JavScript fu is great, try to resist urge to burst into uncontrollable laughter. Promises are (I believe) typically used to ensure the 'order' of callbacks, for example when a series needs to be executed. 

That said, I was having fun in my rabbit hole, and I've spent a grand total of about 30 odd hours hacking on node.js (as of writing) and so if there's a better/simpler way to do this, then feel free to shout.
