var url = require('url');
var mongoose = require('mongoose');

var schema = mongoose.Schema({
  sender: 'string',
  recipient: 'string',
  issue_date: {type: Date, default: Date.now},
  title: 'string',
  description: 'string',
  image_url: 'string'
});

var Badge = exports.Badge = mongoose.model('Badge', schema);

Badge.schema.path('sender').required(true);
Badge.schema.path('recipient').required(true);
Badge.schema.path('title').required(true);
Badge.schema.path('image_url').required(true);

Badge.schema.path('image_url').validate(function(value) {
  return /^https?:$/.test(url.parse(value || '').protocol);
}, 'Protocol must be http or https');
