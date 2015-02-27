module.exports.build = function() {
  var bandicoot = {
    library: {}
  };

  bandicoot.library.strictTyping = require('./strictTyping/index.js').build(bandicoot)
  // require('./events/index.js').build(bandicoot);

  return bandicoot;
}