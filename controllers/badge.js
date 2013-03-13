var Badge = require('../models/badge').Badge;

function ensureLoggedIn(req, res, next) {
  if (!req.session.screenName)
    return res.send("not logged in", 403);
  next();
}

function ensureBadgeOwner(req, res, next) {
  if (req.session.screenName != req.badge.sender)
    return res.send("not sender of badge", 403);
  next();
}

exports.create = [ensureLoggedIn, function(req, res, next) {
  if (!req.body)
    return res.send(400);

  Badge.create({
    sender: req.session.screenName,
    recipient: req.body.recipient,
    title: req.body.title,
    description: req.body.description,
    image_url: req.body.image_url
  }, function(err, badge) {
    if (err) {
      if (err.errors) return res.send(400);
      return next(err);
    }
    return res.send({
      id: badge._id,
      issue_date: badge.issue_date.getTime()
    }, 201);
  });
}];

exports.show = function(req, res, next) {
  var badge = req.badge;
  res.send({
    id: badge._id,
    sender: badge.sender,
    recipient: badge.recipient,
    title: badge.title,
    description: badge.description,
    image_url: badge.image_url,
    issue_date: badge.issue_date.getTime()
  });
};

exports.change = [ensureLoggedIn, ensureBadgeOwner, function(req, res, next) {
  req.badge.recipient = req.body.recipient;
  req.badge.title = req.body.title;
  req.badge.description = req.body.description;
  req.badge.image_url = req.body.image_url;

  req.badge.save(function(err) {
    if (err) {
      if (err.errors) return res.send(400);
      return next(err);
    }
    return res.send(204);    
  });
}];

exports.remove = [ensureLoggedIn, ensureBadgeOwner, function(req, res, next) {
  Badge.remove({_id: req.badge._id}, function(err) {
    if (err) return next(err);
    return res.send(204);
  });
}];

exports.getById = function(req, res, next, id) {
  Badge.find({_id: id}, function(err, badges) {
    var badge;
    if (err) {
      if (err.name == 'CastError' && err.type == 'ObjectId' &&
          err.path == '_id')
        return res.send(404);
      return next(err);
    }
    if (!badges.length) return res.send(404);
    req.badge = badges[0];
    next();
  });
};
