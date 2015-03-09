module.exports.build = function() {
  var bandicoot = {
    library: {}
  };

  bandicoot.library.strictTyping = require('./strictTyping/index.js').build();
  require('./events/index.js').build(bandicoot);

  return bandicoot;
}