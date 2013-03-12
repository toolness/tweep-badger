var appTest = require('./index').appTest;

var fakeOauth = {};

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
      t.same(JSON.parse(body), {screenName: null, userId: null});
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
      t.equal(typeof(body.userId), 'number');
      t.same(body, {screenName: 'hi', userId: 12});
      t.end();
    });
  });

  t.test("/auth/logout works", function(t) {
    a.request.post(a.url('/auth/logout'), function(err, response, body) {
      if (err) throw err;
      t.equal(response.statusCode, 204);
      t.ok(response.headers['set-cookie'][0].match(/connect\.sess=;/));
      t.end();
    });
  });

  t.end();
});
