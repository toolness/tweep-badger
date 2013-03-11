var test = require('tap').test;
var Badge = require('../models/badge').Badge;
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

test("Badge works w/ valid data", function(t) {
  var badge = new Badge({
    sender: 'n',
    recipient: 't',
    title: 'cool',
    description: 'hello hello',
    image_url: 'http://foo.org/bar'
  });
  t.ok(badge.issue_date instanceof Date);
  t.end();
});

test("Badge rejects bad image_url protocol", function(t) {
  var badge = new Badge({
    image_url: 'javascript:lol()'
  });
  badge.save(function(err) {
    t.same(err.errors.image_url.type, "Protocol must be http or https");
    t.end();
  });
});

test("Badge accepts valid image_url protocol", function(t) {
  var badge = new Badge({
    image_url: 'http://foo.org/bar.png'
  });
  badge.save(function(err) {
    t.ok(!err);
    t.end();
  });
});

test("(cleanup)", function(t) {
  mongoose.connection.close();
  t.end();
});
