var dbTest = require('./index').dbTest;
var Badge = require('../models/badge').Badge;

dbTest("Badge model", function(t) {
  t.test("Badge works w/ valid data", function(t) {
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

  t.test("Badge validates required fields", function(t) {
    Badge.create({}, function(err) {
      ['image_url', 'sender', 'recipient', 'title'].forEach(function(name) {
        t.same(err.errors[name].type, "required",
               name + " is a required field");
      });
      t.end();
    });
  });

  t.test("Badge rejects bad image_url protocol", function(t) {
    var badge = new Badge({
      image_url: 'javascript:lol()'
    });
    badge.save(function(err) {
      t.same(err.errors.image_url.type, "Protocol must be http or https");
      t.end();
    });
  });

  t.test("Badge accepts valid image_url protocol", function(t) {
    var badge = new Badge({
      sender: 'n',
      recipient: 't',
      title: 'cool',
      description: 'hello hello',
      image_url: 'http://foo.org/bar.png'
    });
    badge.save(function(err) {
      t.ok(!err);
      t.end();
    });
  });
});
