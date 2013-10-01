var newBadges = new Meteor.Collection(null);

newBadges.insert({
  size: 480,
  background: "#FFAAAA"
});

Template.newBadgeStudio.helpers({
  newBadges: newBadges.find()
});

Template.badgeStudio.events({
  'change #background': function(e, t) {
    newBadges.update({_id: t.data._id}, {
      $set: {background: '#' + e.target.value}
    });
  }
});

Template.badgeStudio.rendered = function() {
  if (!this._badge) {
    var holder = this.find('#canvasHolder');
    this._badge = new BadgeRendering(holder, function() {
      return newBadges.findOne({_id: this.data._id});
    }.bind(this));
    this._bgpicker = new jscolor.color(this.find('#background'), {});
  }
};

var BadgeRendering = function(holder, getOptions) {
  var self = {canvas: null};

  Deps.autorun(function() {
    self.canvas = Chibadge.build(getOptions());
    $(holder).empty();
    holder.appendChild(self.canvas);
  });

  return self;
};
