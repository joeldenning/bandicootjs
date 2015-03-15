module.exports.build = function() {
  var bandicoot = {
    library: {}
  };

  bandicoot.library.strictTyping = require('./strictTyping/index.js').build();
  bandicoot.library.slashNamespacing = require('./slashNamespacing/index.js').build();
  bandicoot.library.domMapping = require('./domMapping/index.js').build(bandicoot.library.strictTyping);
  require('./app/index.js').build(bandicoot);

  return bandicoot;
}