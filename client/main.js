var newBadges = new Meteor.Collection(null);

newBadges.insert({background: "FFAAAA"});

Template.newBadgeStudio.badges = newBadges;
Template.newBadgeStudio.helpers({
  newBadge: function() {
    return {collection: newBadges, badge: newBadges.findOne()};
  }
});

Template.badgeStudio.events({
  'change input[name=background]': function(e, t) {
    t._updateBadge({background: e.target.value});
  }
});

Template.badgeStudio.created = function() {
  var collection = this.data.collection;
  var badge = this.data.badge;

  this._getBadge = function() {
    return collection.findOne({_id: badge._id});
  };
  this._updateBadge = function(updates) {
    collection.update({_id: badge._id}, {$set: updates});
  };
};

Template.badgeStudio.rendered = function() {
  if (!this._badgeCanvas) {
    Deps.autorun(function renderBadge() {
      var holder = this.find('.canvasHolder');
      var options = this._getBadge();
      this._badgeCanvas = Chibadge.build({
        size: 480,
        background: '#' + options.background
      });
      $(holder).empty();
      holder.appendChild(this._badgeCanvas);
    }.bind(this));

    this.findAll('input[data-jscolor]').forEach(function jscolorify(input) {
      if (!input.color) input.color = new jscolor.color(input, {});
    });
  }
};
