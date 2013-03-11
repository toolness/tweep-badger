var url = require('url');
var express = require('express');
var mongoose = require('mongoose');

var Auth = require('./controllers/auth').Auth;

var createApp = module.exports = function createApp(options) {
  var app = express();
  var auth = new Auth({
    consumerKey: options.consumerKey,
    consumerSecret: options.consumerSecret,
    callbackUrl: url.resolve(options.baseUrl, '/auth/callback')
  });

  app.use(express.cookieParser());
  app.use(express.cookieSession({secret: options.cookieSecret}));
  app.use(express.static(__dirname + '/static'));
  app.post('/auth/logout', auth.logout);
  app.get('/auth/login', auth.login);
  app.get('/auth/callback', auth.callback);
  app.get('/auth/info', auth.info);
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

  mongoose.connect(env('MONGODB_URL'));
  app.listen(port, function() {
    console.log("listening on port " + port);
  });
}

if (!module.parent) main();
