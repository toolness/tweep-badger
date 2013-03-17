require([
  "jquery-bootstrap",
  "backbone",
  "auth",
  "utils",
  "badge",
  "badge-view"
], function($, Backbone, Auth, utils, Badge, BadgeView) {
  var DEFAULT_BADGE = {
    title: "Your New Badge",
    sender: "",
    recipient: "MariMoreshead",
    image_url: "http://beta.openbadges.org/_demo/cc.large.png",
    description: "Your description goes here."
  };

  var authReady = $.Deferred();

  authReady.done(function() {
    $(document.body).removeClass("loading");
  });

  $(window).ready(function() {
    var Router = Backbone.Router.extend({
      routes: {
        "": "home",
        "b/:badgeId": "badge"
      },
      home: function() {
        delete badge.id;
        var newBadge = JSON.parse(JSON.stringify(DEFAULT_BADGE));
        newBadge.sender = auth.get("screenName") || "";
        badge.set(newBadge);
        $(document.body).addClass("making-new-badge");
      },
      badge: function(badgeId) {
        if (badge.id != badgeId) {
          badge.id = badgeId;
          badge.fetch();
        }
        $(document.body).removeClass("making-new-badge");
      }
    });
    var router = new Router();
    var auth = new Auth();
    var badge = new Badge();
    var badgeView = BadgeView({
      auth: auth,
      badge: badge,
      template: $("#js-templates .js-badge"),
      target: $("#js-primary-badge")
    });

    auth.fetch();
    auth.on("change", function() {
      $(document.body).toggleClass("logged-in", !!this.attributes.screenName);
      if (this.attributes.screenName) {
        $("img.js-user-avatar")
          .attr("src", utils.avatar(this.get('screenName')));
        $(".js-user-name").text(this.get('screenName'));
      }
      authReady.resolve();
    });
    auth.on("change", function() {
      if (!badge.id)
        badge.set("sender", auth.get("screenName") || "");
    });
    badge.on("change", function() {
      if (badge.id) router.navigate("b/" + badge.id, {trigger: true});
    });
    badge.on("change", badgeView.showBadge);

    $(".js-login").click(auth.login.bind(auth));
    $(".js-logout").click(auth.logout.bind(auth));
    $(".js-issue").click(function() {
      badge.save({}, {
        success: function() {
          var alert = $("#js-templates .js-badge-issued").clone();
          $(".js-badge-link", alert).attr("href", "/b/" + badge.id);
          alert.appendTo("#js-alerts").hide().slideDown();
        }
      });
    });

    Backbone.history.start({pushState: true});
  });
});
