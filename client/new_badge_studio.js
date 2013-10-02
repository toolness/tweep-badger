var newBadges = new Meteor.Collection(null);

var DEFAULT_BADGE = {
  name: "",
  recipients: [],
  background: "FFAAAA"
};

newBadges.insert(DEFAULT_BADGE);

Template.newBadgeStudio.badges = newBadges;

Template.newBadgeStudio.events({
  'click button#submitNewBadge': function(e, t) {
    if (!this.badge.name)
      return alert("Please give your badge a name.");
    if (!this.badge.recipients.length)
      return alert("Please specify at least one recipient.");
    var badge = $.extend({
      issuer: Meteor.user().services.twitter.screenName
    }, this.badge);
    delete badge._id;
    Badges.insert(badge);
    newBadges.update({_id: this.badge._id}, DEFAULT_BADGE);
    alert("Badge issued!");
  }
});

Template.newBadgeStudio.helpers({
  newBadge: function() {
    return {collection: newBadges, badge: newBadges.findOne()};
  }
});
