var newBadges = new Meteor.Collection(null);

var DEFAULT_BADGE = {
  name: "",
  recipients: [],
  description: "",
  background: "FFAAAA"
};

newBadges.insert(DEFAULT_BADGE);

Template.newBadgeStudio.badges = newBadges;

Template.newBadgeStudio.events({
  'click button#submitNewBadge': function(e, t) {
    Meteor.call('issueBadge', this.badge, function(err, id) {
      if (err) return alert(err.reason);
      newBadges.update({_id: this.badge._id}, DEFAULT_BADGE);
      alert("Badge issued!");
    }.bind(this));
  }
});

Template.newBadgeStudio.helpers({
  newBadge: function() {
    return {collection: newBadges, badge: newBadges.findOne()};
  }
});
