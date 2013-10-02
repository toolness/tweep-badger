var newBadges = new Meteor.Collection(null);

newBadges.insert({
  size: 480,
  background: "#FFAAAA"
});

Template.newBadgeStudio.helpers({
  newBadges: newBadges.find()
});

Template.badgeStudio.events({
  'change input[name=background]': function(e, t) {
    newBadges.update({_id: t.data._id}, {
      $set: {background: '#' + e.target.value}
    });
  }
});

Template.badgeStudio.rendered = function() {
  if (!this._badgeCanvas) {
    Deps.autorun(function renderBadge() {
      var holder = this.find('.canvasHolder');
      var options = newBadges.findOne({_id: this.data._id});
      this._badgeCanvas = Chibadge.build(options);
      $(holder).empty();
      holder.appendChild(this._badgeCanvas);
    }.bind(this));

    this.findAll('input[data-jscolor]').forEach(function jscolorify(input) {
      input.color = jscolor.color(input, {});
    });
  }
};
