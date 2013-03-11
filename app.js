var url = require('url');
var querystring = require('querystring');
var express = require('express');
var OAuth = require('oauth').OAuth;

var createApp = module.exports = function createApp(options) {
  var app = express();
  var oa = new OAuth("https://api.twitter.com/oauth/request_token",
                     "https://api.twitter.com/oauth/access_token",
                     options.consumerKey,
                     options.consumerSecret,
                     "1.0A",
                     url.resolve(options.baseUrl, '/auth/callback'),
                     "HMAC-SHA1");

  app.use(express.cookieParser(options.cookieSecret));
  app.use(express.static(__dirname + '/static'));
  app.post('/auth/logout', function(req, res, next) {
    res.clearCookie("oauth");
    return res.send(204);
  });
  app.get('/auth/login', function(req, res, next) {
    oa.getOAuthRequestToken(function(err, token, secret, results) {
      if (err) return next(err);
      res.cookie("oauth", {
        requestToken: token,
        requestSecret: secret
      }, {signed: true});
      return res.redirect('https://twitter.com/oauth/authenticate?' +
                          querystring.stringify({
                            oauth_token: token,
                            force_login: "true"
                          }));
    });
  });
  app.get('/auth/callback', function(req, res, next) {
    var oauth = req.signedCookies.oauth;
    if (!(oauth && oauth.requestToken && oauth.requestSecret))
      return next(new Error("callback called, but no info in cookie"));
    oa.getOAuthAccessToken(
      oauth.requestToken,
      oauth.requestSecret,
      req.query.oauth_verifier,
      function(err, accessToken, accessSecret, results) {
        if (err) return next(err);
        res.cookie("oauth", {
          accessToken: accessToken,
          accessSecret: accessSecret,
          userId: results.user_id,
          screenName: results.screen_name
        }, {signed: true});
        return res.send("<script>window.close();</script>");
      }
    );
  });
  app.get('/auth/info', function(req, res, next) {
    var oauth = req.signedCookies.oauth || {};
    var info = {screenName: null, userId: null};

    if (oauth.screenName) {
      info.screenName = oauth.screenName;
      info.userId = oauth.userId;
    }

    return res.send(info);
  });
  app.use(function(err, req, res, next) {
    console.error(err);
    return res.send(500, "Sorry, an error occurred.");
  });

  return app;
};

function env(name) {
  if (!process.env[name])
    throw new Error(name + " environment variable is not defined");
  return process.env[name];
}

function main() {
  var port = parseInt(process.env['PORT']);
  var app = createApp({
    cookieSecret: env('COOKIE_SECRET'),
    consumerKey: env('TWITTER_CONSUMER_KEY'),
    consumerSecret: env('TWITTER_CONSUMER_SECRET'),
    baseUrl: env('BASE_URL')
  });

  app.listen(port, function() {
    console.log("listening on port " + port);
  });
}

if (!module.parent) main();
