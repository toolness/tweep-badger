var fs = require('fs');
var loadedDotEnv = false;

function loadDotEnv() {
  var filename = __dirname + '/.env';

  if (fs.existsSync(filename)) {
    var contents = fs.readFileSync(filename, 'utf-8');
    console.log("loading environment variables in .env file");
    contents.split('\n').forEach(function(line) {
      var parts = line.split('=', 2);
      if (parts.length == 2)
        process.env[parts[0]] = parts[1];
    });
  }
}

var env = module.exports = function env(name, defaultValue) {
  if (!loadedDotEnv) {
    loadDotEnv();
    loadedDotEnv = true;
  }
  if (!process.env[name]) {
    if (arguments.length == 1)
      throw new Error(name + " environment variable is not defined");
    return defaultValue;
  }
  return process.env[name];
};
