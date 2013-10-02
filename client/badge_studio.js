Template.badgeStudio.events({
  'change input[name=background]': function(e, t) {
    t._updateBadge({background: e.target.value});
  }
});

Template.badgeStudio.created = function() {
  this._updateBadge = function(updates) {
    var collection = this.data.collection;
    var badge = this.data.badge;

    collection.update({_id: badge._id}, {$set: updates});
  };
};

Template.badgeStudio.rendered = function() {
  this.findAll('input[data-jscolor]').forEach(function jscolorify(input) {
    if (!input.color) input.color = new jscolor.color(input, {});
  });
};
