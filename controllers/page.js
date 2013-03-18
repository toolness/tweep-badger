var fs = require('fs');

exports.bootstrapped = function(creators, filename) {
  return function(req, res, next) {
    var initialData = {};
    Object.keys(creators).forEach(function(key) {
      initialData[key] = creators[key](req);
    });
    fs.readFile(filename, {
      encoding: 'utf8'
    }, function(err, data) {
      if (err) return next(err);
      data = data.toString();
      res.type('text/html; charset=utf-8');
      res.send(data.replace('INITIAL_DATA = {}',
                            'INITIAL_DATA = ' + JSON.stringify(initialData)));
    });
  };
};
