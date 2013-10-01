Template.badgeStudio.events({
  'change #background': function(e, t) {
    renderBadge(t);
  }
});

Template.badgeStudio.rendered = function() {
  if (!this._canvas) {
    renderBadge(this);
    this._bgpicker = new jscolor.color(this.find('#background'), {});
  }
};

var renderBadge = function(template) {
  var holder = template.find('#canvasHolder');
  $(holder).empty();
  template._canvas = Chibadge.build({
    size: 480,
    background: '#' + template.find('#background').value
  });
  holder.appendChild(template._canvas);
};
