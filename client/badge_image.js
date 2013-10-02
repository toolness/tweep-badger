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

Template.badgeImage.rendered = function() {
  this._canvas = renderBadge(this.find('.canvasHolder'), this.data);
};
