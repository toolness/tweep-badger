define(function() {
  var BASE_AVATAR_URL = "http://twitter.com/api/users/profile_image/";

  return {
    avatar: function(name) { return BASE_AVATAR_URL + name; }
  };
});
