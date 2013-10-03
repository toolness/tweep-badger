var BADGE_SIZE = 480;

var getBadgeHash = function(badge) {
  return JSON.stringify([badge.background]);
};

var renderBadge = function(holder, badge) {
  var canvas = Chibadge.build({
    size: BADGE_SIZE,
    background: '#' + badge.background
  });
  $(holder).empty();
  holder.appendChild(canvas);
  return canvas;
};

Template.badgeImage.rendered = function() {
  var hash = getBadgeHash(this.data);
  if (this._lastHash != hash) {
    this._lastHash = hash;
    this._canvas = renderBadge(this.find('.canvasHolder'), this.data);
  }
};
