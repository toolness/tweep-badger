var badgesBeingEdited = new Meteor.Collection(null);

Template.allBadges.events({
  'click button[name=revoke]': function(e, t) {
    if (!confirm('Are you sure you want to revoke the badge "' +
                 this.name + '"? This cannot be undone.')) return;
    Badges.remove({_id: this._id});
  },
  'click button[name=edit]': function(e, t) {
    badgesBeingEdited.insert(this);
  },
  'click button[name=cancel]': function(e, t) {
    badgesBeingEdited.remove({_id: this._id});
  },
  'click button[name=commit]': function(e, t) {
    var updatedBadge = badgesBeingEdited.findOne({_id: this._id});
    Badges.update({_id: this._id}, updatedBadge);
    badgesBeingEdited.remove({_id: this._id});
  }
});

Template.allBadges.badgesBeingEdited = badgesBeingEdited;

Template.allBadges.helpers({
  badges: function() { return Badges.find(); },
  isBeingEdited: function() {
    return !!badgesBeingEdited.findOne({_id: this._id});
  },
  editableBadge: function() {
    return {
      collection: badgesBeingEdited,
      badge: badgesBeingEdited.findOne({_id: this._id})
    };
  },
  issuedByCurrentUser: function() {
    var user = Meteor.user();
    return (user && user.services.twitter.screenName == this.issuer);
  }
});
