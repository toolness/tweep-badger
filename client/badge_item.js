Template.badgeItem.helpers({
  sanitizedDescription: function() {
    var converter = Markdown.getSanitizingConverter();
    return converter.makeHtml(this.description || '');
  },
  issuerAvatarUrl: function() {
    var issuer = Meteor.users.findOne({
      'services.twitter.screenName': this.issuer
    });
    return issuer.services.twitter.profile_image_url_https;
  }
});
