var Badge = require('../models/badge').Badge;

exports.create = function(req, res, next) {
  if (!req.session.screenName)
    return res.send(403);

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
      url: req.path + '/' + badge._id
    }, 201);
  });
};

exports.getById = function(req, res, next) {
  Badge.find({_id: req.params.id}, function(err, badges) {
    var badge;
    if (err) {
      if (err.name == 'CastError' && err.type == 'ObjectId' &&
          err.path == '_id')
        return res.send(404);
      return next(err);
    }
    if (!badges.length) return res.send(404);
    badge = badges[0];
    res.send({
      id: badge._id,
      sender: badge.sender,
      recipient: badge.recipient,
      title: badge.title,
      description: badge.description,
      image_url: badge.image_url,
      issue_date: badge.issue_date.getTime()
    });
  });
};
