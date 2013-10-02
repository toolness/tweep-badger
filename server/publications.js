Meteor.publish("allUsers", function() {
  return Meteor.users.find({}, {
    fields: {
      'services.twitter.screenName': 1,
      'services.twitter.profile_image_url': 1,
      'services.twitter.profile_image_url_https': 1,
    }
  });
});

Meteor.publish("allBadges", function() {
  return Badges.find();
});
