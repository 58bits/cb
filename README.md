Node.js and Couchbase
====================

An experimental RESTful API built with node.js, express and couchbase.

Installation
------------

Assumes you have node.js and npm installed (for Mac OS X - `brew install node`).

Download and install [Couchbase](http://www.couchbase.com/download) 

Clone this repository `git clone https://github.com/58bits/cb.git`

Create a bucket called `test` using the admin interface (assuming you have Couchbase installed and running). Or create a bucket using whatever name you like, and update 'connection.js' to point to that bucket instead.

From inside the cloned git repository...

`npm install`

... will install all the required npm modules locally under 'node_modules'.

`make test` - will run the tests.

`node server.js` - will start the express server on `http://localhost:3000`

If everything is working you should see a list of two users on `http://localhost:3000/api/users`


Problem with Supertest
----------------------

Here's the problem.

Couchbases's `driver.connect` expects the open Couchbase connection (`cb`) to be wrapped in a callback which includes whatever mechanism the server is going to respond to (http listener etc. - keeping the connection open all the while the server is running). 

I created `connection.js` as a generic way to open the connection, and then execute the listeners, or in the case if Supertest - the tests.

The regular http server listener works fine. However, from inside `/test/01-api.js`, unless there is some 'work' that occurs before the connection method is called, `driver.connect` in `connection.js` silently fails.

I've placed three dummy describe('Array',... tests above the connection(function(err, cb) setup for the api test. If the dummy tests are remove. Nothing runs. Nada - no console output or warnings.

What's happening here? Am I doing this wrong? 


