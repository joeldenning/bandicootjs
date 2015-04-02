module.exports.build = function() {
  var bandicoot = {
    library: {}
  };

  bandicoot.library.cloneDeep = require('./cloneDeep/index.js').build();
  bandicoot.library.strictTyping = require('./strictTyping/index.js').build();
  bandicoot.library.slashNamespacing = require('./slashNamespacing/index.js').build();
  bandicoot.library.domElements = require('./domElements/index.js').build(bandicoot.library.strictTyping);
  bandicoot.library.domMapping = require('./domMapping/index.js').build(bandicoot.library.strictTyping,
  	bandicoot.library.domElements, bandicoot.library.cloneDeep);
  bandicoot.library.domEvents = require('./domEvents/index.js').build(bandicoot.library.domMapping);
  bandicoot.library.domPatching = require('./domPatching/index.js').build(bandicoot.library.cloneDeep);
  require('./app/index.js').build(bandicoot);

  return bandicoot;
}