var querystring = require('querystring');

exports.logout = function logout(req, res, next) {
  req.session = null;
  return res.send(204);
};

exports.login = function(oauth) {
  return function login(req, res, next) {
    oauth.getOAuthRequestToken(function(err, token, secret, results) {
      if (err) return next(err);
      req.session = {requestToken: token, requestSecret: secret};
      return res.redirect('https://twitter.com/oauth/authenticate?' +
                          querystring.stringify({
                            oauth_token: token,
                            force_login: "true"
                          }));
    });
  };
};

exports.callback = function(oauth) {
  return function callback(req, res, next) {
    if (!(req.session.requestToken && req.session.requestSecret))
      return next(new Error("callback called, but no info in session"));
    oauth.getOAuthAccessToken(
      req.session.requestToken,
      req.session.requestSecret,
      req.query.oauth_verifier,
      function(err, accessToken, accessSecret, results) {
        if (err) return next(err);
        req.session = {
          accessToken: accessToken,
          accessSecret: accessSecret,
          userId: results.user_id,
          screenName: results.screen_name
        };
        return res.send("<script>window.close();</script>");
      }
    );
  };
};

exports.info = function(req, res, next) {
  var info = {screenName: null, userId: null};

  if (req.session.screenName) {
    info.screenName = req.session.screenName;
    info.userId = req.session.userId;
  }

  return res.send(info);
};
