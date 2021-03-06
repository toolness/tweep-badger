var querystring = require('querystring');
var OAuth = require('oauth').OAuth;

exports.Auth = function Auth(options) {
  var self = {};
  var authenticateUrl = options.authenticateUrl ||
                        'https://twitter.com/oauth/authenticate';
  var oauth = options.oauth || new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    options.consumerKey,
    options.consumerSecret,
    "1.0A",
    options.callbackUrl,
    "HMAC-SHA1"
  );

  self.logout = function logout(req, res, next) {
    req.session.screenName = null;
    req.session.userId = null;
    return res.send(204);
  };

  self.login = function login(req, res, next) {
    oauth.getOAuthRequestToken(function(err, token, secret, results) {
      if (err) return next(err);
      req.session.requestToken = token;
      req.session.requestSecret = secret;
      return res.redirect(authenticateUrl + '?' +
                          querystring.stringify({
                            oauth_token: token,
                            force_login: "true"
                          }));
    });
  };

  self.callback = function callback(req, res, next) {
    if (!(req.session.requestToken && req.session.requestSecret))
      return next(new Error("callback called, but no info in session"));
    oauth.getOAuthAccessToken(
      req.session.requestToken,
      req.session.requestSecret,
      req.query.oauth_verifier,
      function(err, accessToken, accessSecret, results) {
        if (err) return next(err);
        delete req.session.requestToken;
        delete req.session.requestSecret;
        req.session.accessToken = accessToken;
        req.session.accessSecret = accessSecret;
        req.session.userId = parseInt(results.user_id);
        req.session.screenName = results.screen_name;
        return res.send("<script>window.close();</script>");
      }
    );
  };

  self.infoAsJSON = function(req) {
    var info = {screenName: null, userId: null, _csrf: req.session._csrf};

    if (req.session.screenName) {
      info.screenName = req.session.screenName;
      info.userId = req.session.userId;
    }

    return info;
  };

  self.info = function(req, res, next) {
    return res.send(self.infoAsJSON(req));
  };

  return self;
};
