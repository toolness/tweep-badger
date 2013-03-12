var http = require('http');
var url = require('url');
var mongoose = require('mongoose');
var tap = require('tap');
var request = require('request');
var createApp = require('../app');

var dbTest = exports.dbTest = function dbTest(name, cb) {
  var test = tap.test.bind(tap);

  test("(setup db)", function(t) {
    var mongoUrl = process.env['MONGODB_TEST_URL'] ||
                   'mongodb://localhost/test';
    mongoose.connect(mongoUrl, function(err) {
      if (err) throw err;
      mongoose.connection.db.dropDatabase(function(err) {
        if (err) throw err;
        t.end();
      });
    });
  });

  test(name, cb);

  test("(teardown db)", function(t) {
    mongoose.disconnect(function(err) {
      if (err) throw err;
      t.end();
    });
  });
};

var appTest = exports.appTest = function appTest(name, options, cb) {
  var self = {};
  var app = self.app = createApp(options.appOptions);
  var server = self.server = http.createServer(app);
  var test = options.t ? options.t.test.bind(options.t) : tap.test.bind(tap);

  self.url = function(path) {
    return url.resolve('http://localhost:' + server.address().port, path);
  };
  self.request = request.defaults({
    jar: request.jar(),
    followRedirect: false
  });

  test("(setup app)", function(t) {
    server.listen(0, function(err) {
      if (err) throw err;
      t.end();
    });
  });

  test(name, function(t) { cb(t, self); });

  test("(teardown app)", function(t) {
    server.close(function(err) {
      if (err) throw err;
      t.end();
    });
  });

  if (options.t) options.t.end();
};
