var appTest = require('./index').appTest;

var fakeOauth = {};
var csrf;

appTest("/auth", {
  appOptions: {
    cookieSecret: 'lol',
    oauth: fakeOauth,
    authenticateUrl: 'http://foo.org/auth'
  }
}, function(t, a) {
  t.test("/auth/info before login works", function(t) {
    a.request(a.url('/auth/info'), function(err, response, body) {
      t.equal(response.statusCode, 200);
      body = JSON.parse(body);
      t.equal(body.screenName, null);
      t.equal(body.userId, null);
      t.equal(typeof(body._csrf), "string");
      csrf = body._csrf;
      t.end();
    });
  });

  t.test("/auth/login works", function(t) {
    fakeOauth.getOAuthRequestToken = function(cb) {
      cb(null, "reqtoken", "reqsecret");
    };
    a.request(a.url('/auth/login'), function(err, response, body) {
      if (err) throw err;
      t.equal(response.statusCode, 302);
      t.equal(response.headers['location'],
              'http://foo.org/auth?oauth_token=reqtoken&force_login=true');
      t.end();
    });
  });

  t.test("/auth/callback works", function(t) {
    fakeOauth.getOAuthAccessToken = function(token, secret, verifier, cb) {
      t.equal(token, "reqtoken");
      t.equal(secret, "reqsecret");
      t.equal(verifier, "v2");
      cb(null, "atoken", "asecret", {user_id: '12', screen_name: 'hi'});
    };
    a.request(a.url('/auth/callback?oauth_verifier=v2'),
              function(err, res, body) {
                t.equal(res.statusCode, 200);
                t.equal(body, '<script>window.close();</script>');
                t.end();
              });
  });

  t.test("/auth/info after login works", function(t) {
    a.request(a.url('/auth/info'), function(err, response, body) {
      if (err) throw err;
      body = JSON.parse(body);
      t.equal(response.statusCode, 200);
      t.equal(body.userId, 12);
      t.equal(body.screenName, 'hi');
      t.end();
    });
  });

  t.test("/auth/logout works", function(t) {
    a.request.post(a.url('/auth/logout'), {
      json: {_csrf: csrf}
    }, function(err, response, body) {
      if (err) throw err;
      t.equal(response.statusCode, 204);
      t.end();
    });
  });

  t.end();
});
