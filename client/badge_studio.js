var isValidTwitterName = function(name) {
  return /^([A-Za-z0-9_]+)$/.test(name) && name.length < 16;
};

Template.badgeStudio.events({
  'change input[name=background]': function(e, t) {
    t._updateBadge({background: e.target.value});
  },
  'change input[name=name]': function(e, t) {
    t._updateBadge({name: e.target.value});
  },
  'change input[name=recipients]': function(e, t) {
    var recipients = e.target.value.split(' ').map(function(name) {
      return name.trim();
    }).filter(isValidTwitterName);
    t._updateBadge({recipients: recipients});
  }
});

Template.badgeStudio.helpers({
  spaceSeparatedRecipients: function() {
    return this.recipients.join(' ');
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
