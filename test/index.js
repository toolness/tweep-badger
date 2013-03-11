var mongoose = require('mongoose');
var test = require('tap').test;

var dbTest = exports.dbTest = function dbTest(name, cb) {
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
}
