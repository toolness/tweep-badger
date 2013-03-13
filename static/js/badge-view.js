define(["jquery", "utils"], function($, utils) {
  function makeEditable(element, isEditable, badge, field) {
    var onClick = function(e) {
      if (!isEditable()) return;

      var self = $(this);
      var input = $('<input type="text">').val(badge.get(field));
      var cancel = function() {
        input.replaceWith(self);
        self.click(onClick);
      };

      self.replaceWith(input);
      input.focus().select().on("keyup", function(e) {
        if (e.keyCode == 27) {
          cancel();
        } else if (e.keyCode == 13) {
          badge.set(field, input.val());
          if (badge.id) badge.save();
        }
      }).on("blur", cancel);
    };

    element.text(badge.get(field)).click(onClick);
  }

  return function BadgeView(options) {
    var self = {};
    var auth = options.auth;
    var badge = options.badge;
    var template = options.template;
    var target = options.target;

    var isEditable = function() {
      var currUser = auth.get("screenName");
      return (!badge.id || (currUser && currUser == badge.get("sender")));
    };

    self.showBadge = function() {
      var e = template.clone();

      makeEditable($(".js-title", e), isEditable, badge, "title");
      makeEditable($(".js-description", e), isEditable, badge, "description");
      makeEditable($(".js-recipient", e), isEditable, badge, "recipient");

      $(".js-sender", e).text(badge.get("sender"));
      $(".js-image", e).attr("src", badge.get("image_url"));
      $(".js-sender-avatar", e).attr("src",
        badge.get("sender") ? utils.avatar(badge.get("sender")) : "");
      $(".js-recipient-avatar", e)
        .attr("src", utils.avatar(badge.get("recipient")));
      target.empty().append(e);
    };

    return self;
  };
});
