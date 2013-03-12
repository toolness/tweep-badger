define(["jquery", "backbone"], function($, Backbone) {
  var Auth = Backbone.Model.extend({
    initialize: function() {
      $(document).on("ajaxSend", this._addCsrfHeaderToRequest.bind(this));
    },
    url: function() { return "/auth/info"; },
    login: function() {
      var fetch = this.fetch.bind(this);
      var popup = window.open("/auth/login", undefined, "width=640,height=480");
      var checkIfClosed = window.setInterval(function() {
        if (popup.closed) {
          window.clearInterval(checkIfClosed);
          fetch();
        }
      }, 100);
    },
    logout: function() { $.post("/auth/logout", this.fetch.bind(this)); },
    _addCsrfHeaderToRequest: function(event, xhr, settings) {
      if (settings.type == "POST" && !settings.crossDomain)
        xhr.setRequestHeader('X-CSRF-Token', this.get('_csrf'));
    },
  });

  return Auth;
});
