Badges = new Meteor.Collection("badges");

Badges.isValidTwitterName = function(name) {
  return /^([A-Za-z0-9_]+)$/.test(name) && name.length < 16;
};

Badges.isValidColor = function(color) {
  return /^[A-Fa-f0-9]+$/.test(color) && color.length == 6;
};

var userIsNotOwner = function(userId, doc) {
  if (!userId) return true;
  if (!doc.issuer) return true;
  var user = Meteor.users.findOne({_id: userId});
  if (!user) return true;
  if (user.services.twitter.screenName != doc.issuer)
    return true;
  return false;
}

Badges.deny({
  insert: userIsNotOwner,
  update: userIsNotOwner,
  remove: userIsNotOwner
});

Badges.allow({
  remove: function() { return true; }
});

var validateEditableFields = function(badge) {
  badge = _.pick(badge, 'name', 'recipients', 'description', 'background');

  check(badge.recipients, Array);
  badge.recipients.forEach(function(recipient) {
    check(recipient, String);
  });
  check(badge.name, String);
  check(badge.description, String);
  check(badge.background, String);

  if (!badge.name.length)
    throw new Meteor.Error(422, 'Badge must have a name.');
  if (!badge.recipients.length)
    throw new Meteor.Error(422, 'Badge must have at least one recipient');
  badge.recipients.forEach(function(r) {
    if (!Badges.isValidTwitterName(r))
      throw new Meteor.Error(422, 'Invalid twitter name: ' + r);
  });

  if (!Badges.isValidColor(badge.background))
    throw new Meteor.Error(422, 'Invalid background: ' + badge.background);

  return badge;
};

Meteor.methods({
  issueBadge: function(badge) {
    var user = Meteor.user();
    if (!user) throw new Meteor.Error(401, "Login required");
    badge = _.extend(validateEditableFields(badge), {
      issuer: user.services.twitter.screenName,
      issued: Date.now()
    });
    return Badges.insert(badge);
  },
  editBadge: function(badge) {
    var user = Meteor.user();
    var originalBadge = Badges.findOne({_id: badge._id});
    if (!user) throw new Meteor.Error(401, "Login required");

    if (userIsNotOwner(user._id, originalBadge))
      throw new Meteor.Error(403, 'User is not badge issuer');
    Badges.update({_id: badge._id}, {$set: validateEditableFields(badge)});
  }
});
