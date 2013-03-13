var url = require('url');
var express = require('express');
var mongoose = require('mongoose');

var env = require('./env');
var Auth = require('./controllers/auth').Auth;
var badge = require('./controllers/badge');

var createApp = module.exports = function createApp(options) {
  var app = express();
  var auth = new Auth({
    oauth: options.oauth,
    authenticateUrl: options.authenticateUrl,
    consumerKey: options.consumerKey,
    consumerSecret: options.consumerSecret,
    callbackUrl: url.resolve(options.baseUrl, '/auth/callback')
  });

  app.param('badgeId', badge.getById);

  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(options.sessionMiddleware ||
          express.cookieSession({secret: options.cookieSecret}));
  app.use(express.csrf());
  app.use(express.static(__dirname + '/static'));
  app.post('/auth/logout', auth.logout);
  app.get('/auth/login', auth.login);
  app.get('/auth/callback', auth.callback);
  app.get('/auth/info', auth.info);
  app.post('/badge', badge.create);
  app.get('/badge/:badgeId', badge.show);
  app.use(function(err, req, res, next) {
    if (err.status)
      return res.send(err.status);
    console.error(err);
    return res.send(500, "Sorry, an error occurred.");
  });

  return app;
};

function main() {
  var port = parseInt(env('PORT'));
  var app = createApp({
    cookieSecret: env('COOKIE_SECRET'),
    consumerKey: env('TWITTER_CONSUMER_KEY'),
    consumerSecret: env('TWITTER_CONSUMER_SECRET'),
    baseUrl: env('BASE_URL')
  });

  mongoose.connect(env('MONGODB_URL'));
  app.listen(port, function() {
    console.log("listening on port " + port);
  });
}

if (!module.parent) main();
