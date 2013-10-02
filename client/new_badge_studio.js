var newBadges = new Meteor.Collection(null);

newBadges.insert({background: "FFAAAA"});

Template.newBadgeStudio.badges = newBadges;
Template.newBadgeStudio.helpers({
  newBadge: function() {
    return {collection: newBadges, badge: newBadges.findOne()};
  }
});
