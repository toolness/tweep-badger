var BADGE_SIZE = 480;

var renderBadge = function(holder, badge) {
  var canvas = Chibadge.build({
    size: BADGE_SIZE,
    background: '#' + badge.background
  });
  $(holder).empty();
  holder.appendChild(canvas);
  return canvas;
};

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
  this._canvas = renderBadge(this.find('.canvasHolder'), this.data.badge);
  this.findAll('input[data-jscolor]').forEach(function jscolorify(input) {
    if (!input.color) input.color = new jscolor.color(input, {});
  });
};
