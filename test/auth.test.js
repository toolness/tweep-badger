var test = require('tap').test;
var createApp = require('../app');
var http = require('http');
var url = require('url');
var request = require('request');

var fakeOauth = {};
var app = createApp({
  cookieSecret: 'lol',
  oauth: fakeOauth,
  authenticateUrl: 'http://foo.org/auth'
});
var server = http.createServer(app);
var req = request.defaults({
  jar: request.jar(),
  followRedirect: false
});
var resolve = function(path) {
  return url.resolve('http://localhost:' + server.address().port, path);
};

test("(setup server)", function(t) {
  server.listen(0, function(err) {
    if (err) throw err;
    t.end();
  });
});

test("/auth/login works", function(t) {
  fakeOauth.getOAuthRequestToken = function(cb) {
    cb(null, "reqtoken", "reqsecret");
  };
  req(resolve('/auth/login'), function(err, response, body) {
    t.equal(response.statusCode, 302);
    t.equal(response.headers['location'],
            'http://foo.org/auth?oauth_token=reqtoken&force_login=true');
    t.end();
  });
});

test("/auth/callback works", function(t) {
  fakeOauth.getOAuthAccessToken = function(token, secret, verifier, cb) {
    t.equal(token, "reqtoken");
    t.equal(secret, "reqsecret");
    t.equal(verifier, "v2");
    cb(null, "atoken", "asecret", {user_id: 1, screenName: 'hi'});
  };
  req(resolve('/auth/callback?oauth_verifier=v2'), function(err, res, body) {
    t.equal(res.statusCode, 200);
    t.equal(body, '<script>window.close();</script>');
    t.end();
  });
});

test("(teardown server)", function(t) {
  server.close(function(err) {
    if (err) throw err;
    t.end();
  });
});
