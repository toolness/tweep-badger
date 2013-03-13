var testing = require('./index');

var fakeSession = {};
var badgeUrl, badgeId;

function login(screenName) { fakeSession.screenName = screenName; }
function logout() { fakeSession.screenName = null; }

testing.dbTest("/badge", function(t) {
  testing.appTest("", {
    t: t,
    appOptions: {
      sessionMiddleware: function(req, res, next) {
        req.session = fakeSession;
        next();
      }
    }
  }, function(t, a) {
    t.test("POST /badge fails when not logged in", function(t) {
      logout();
      a.request.post(a.url("/badge"), function(err, response, body) {
        if (err) throw err;
        t.equal(response.statusCode, 403);
        t.end();
      });
    });

    t.test("POST /badge fails w/ no csrf", function(t) {
      login('hi');
      a.request.post(a.url("/badge"), function(err, response, body) {
        if (err) throw err;
        t.equal(response.statusCode, 403);
        t.end();
      });
    });

    t.test("POST /badge fails when no body present", function(t) {
      login('hi');
      a.request.post(a.url("/badge"), {
        json: {_csrf: fakeSession._csrf}
      }, function(err, response, body) {
        if (err) throw err;
        t.equal(response.statusCode, 400);
        t.end();
      });
    });

    t.test("POST /badge works", function(t) {
      login('hi');
      a.request.post(a.url("/badge"), {
        json: {
          _csrf: fakeSession._csrf,
          recipient: 'foo',
          title: 'awesome person',
          description: 'person is cool',
          image_url: 'http://foo.org'
        }
      }, function(err, response, body) {
        if (err) throw err;
        t.equal(response.statusCode, 201);
        t.equal(typeof(body.id), "string");
        t.ok(body.url && body.url.match(/\/badge\/.+$/));
        badgeUrl = body.url;
        badgeId = body.id;
        t.end();
      });
    });

    t.test("GET /badge/:id works", function(t) {
      logout();
      a.request(a.url(badgeUrl), function(err, response, body) {
        if (err) throw err;
        t.equal(response.statusCode, 200);
        body = JSON.parse(body);
        t.equal(body.id, badgeId);
        t.equal(body.sender, 'hi');
        t.equal(body.recipient, 'foo');
        t.equal(body.title, 'awesome person');
        t.equal(body.description, 'person is cool');
        t.equal(body.image_url, 'http://foo.org');
        t.equal(typeof(body.issue_date), 'number');
        t.end();
      });
    });

    t.test("POST /badge returns 400 on bad image url", function(t) {
      login('hi');
      a.request.post({
        url: a.url("/badge"),
        json: {
          _csrf: fakeSession._csrf,
          recipient: 'foo',
          title: 'awesome person',
          description: 'persion is cool',
          image_url: 'javascript:lol()'
        }
      }, function(err, response, body) {
        if (err) throw err;
        t.equal(response.statusCode, 400);
        t.end();
      });
    });

    t.test("GET /badge/nonexistent returns 404", function(t) {
      logout();
      a.request(a.url("/badge/nonexistent"), function(err, response) {
        if (err) throw err;
        t.equal(response.statusCode, 404);
        t.end();
      });
    });

    t.test("PUT /badge/:id fails when required fields missing", function(t) {
      login('hi');
      a.request.put(a.url(badgeUrl), {
        json: {
          _csrf: fakeSession._csrf,
          title: "oof"
        }
      }, function(err, response) {
        if (err) throw err;
        t.equal(response.statusCode, 400);
        t.end();
      });
    });

    t.test("PUT /badge/:id fails when not logged in", function(t) {
      logout();
      a.request.put(a.url(badgeUrl), {
        json: {
          _csrf: fakeSession._csrf
        }
      }, function(err, response) {
        if (err) throw err;
        t.equal(response.statusCode, 403);
        t.end();
      });
    });

    t.test("PUT /badge/:id fails when not owner", function(t) {
      login("blarg");
      a.request.put(a.url(badgeUrl), {
        json: {
          _csrf: fakeSession._csrf
        }
      }, function(err, response) {
        if (err) throw err;
        t.equal(response.statusCode, 403);
        t.equal(response.body, "not sender of badge");
        t.end();
      });
    });

    t.test("PUT /badge/:id works", function(t) {
      login('hi');
      a.request.put(a.url(badgeUrl), {
        json: {
          _csrf: fakeSession._csrf,
          recipient: "bleg",
          title: "oof",
          description: 'nifty',
          image_url: 'http://lol/blah.png'
        }
      }, function(err, response) {
        if (err) throw err;
        t.equal(response.statusCode, 204);
        t.end();
      });
    });

    t.test("GET /badge/:id after PUT works", function(t) {
      logout();
      a.request(a.url(badgeUrl), function(err, response, body) {
        if (err) throw err;
        t.equal(response.statusCode, 200);
        body = JSON.parse(body);
        t.equal(body.sender, 'hi');
        t.equal(body.recipient, 'bleg');
        t.equal(body.title, 'oof');
        t.equal(body.description, 'nifty');
        t.equal(body.image_url, 'http://lol/blah.png');
        t.end();
      });
    });

    t.test("DELETE /badge/:id fails when not owner", function(t) {
      login('blarg');
      a.request.del(a.url(badgeUrl), {
        form: {_csrf: fakeSession._csrf}
      }, function(err, response) {
        if (err) throw err;
        t.equal(response.statusCode, 403);
        t.end();
      });
    });

    t.test("DELETE /badge/:id works", function(t) {
      login('hi');
      a.request.del(a.url(badgeUrl), {
        form: {_csrf: fakeSession._csrf}
      }, function(err, response) {
        if (err) throw err;
        t.equal(response.statusCode, 204);
        t.test("GET /badge/:id returns 404 after deletion", function(t) {
          logout();
          a.request(a.url(badgeUrl), function(err, response) {
            if (err) throw err;
            t.equal(response.statusCode, 404);
            t.end();
          });
        });
        t.end();
      });
    });

    t.end();
  });
});
