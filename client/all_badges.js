Template.allBadges.events({
  'click button[name=revoke]': function(e, t) {
    if (!confirm('Are you sure you want to revoke the badge "' +
                 this.name + '"? This cannot be undone.')) return;
    Badges.remove({_id: this._id});
  }
});

Template.allBadges.helpers({
  badges: function() {  return Badges.find(); },
  issuerAvatarUrl: function() {
    var issuer = Meteor.users.findOne({
      'services.twitter.screenName': this.issuer
    });
    return issuer.services.twitter.profile_image_url_https;
  },
  issuedByCurrentUser: function() {
    var user = Meteor.user();
    return (user && user.services.twitter.screenName == this.issuer);
  }
});
