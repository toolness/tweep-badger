require.config({
  baseUrl: "/js",
  shim: {
    'underscore': {
      exports: '_',
      init: function() { return this._.noConflict(); }
    },
    'backbone': {
      deps: ["underscore", "jquery"],
      exports: "Backbone",
      init: function() { return this.Backbone.noConflict(); }
    },
    'jquery-bootstrap': {
      deps: ["jquery"],
      exports: ["jQuery"],
      init: function() { return this.jQuery.noConflict(); }
    }
  },
  paths: {
    // Vendor paths
    "jquery": "../vendor/jquery",
    "jquery-bootstrap": "../vendor/bootstrap/js/bootstrap",
    "underscore": "../vendor/underscore",
    "backbone": "../vendor/backbone"
  },
});
