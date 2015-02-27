var assert = require('chai').assert;

describe('When Bandicoot initializes,', function() {
  var module, bandicoot;
  var isProductionEnvironment = false;

  beforeEach(function() {
    var path = process.cwd() + '/src/bandicoot-builder.js';
    delete require.cache[path];
    module = require(path);
  });

  it('no errors are thrown', function() {
    module.build();
  });

  describe('', function() {
    beforeEach(function() {
      bandicoot = module.build();
    })

    it('returns an object with a library', function() {
      assert(typeof bandicoot.library !== 'undefined', 'bandicoot = ' + bandicoot);
    });

    it('returns library functions whose names are alphanumeric', function() {
      var libraryFuncs = Object.keys(bandicoot.library);
      libraryFuncs.forEach(function(libraryFunc) {
        assert(libraryFunc.match(/[a-zA-Z0-9]+/), libraryFunc + 'does not have an alphanumeric name');      
      });
    });

    it('returns library functions whose names do not end in js', function() {
      var libraryFuncs = Object.keys(bandicoot.library);
      libraryFuncs.forEach(function(libraryFunc) {
        assert(libraryFunc.match(/.*js/) === null, '"' + libraryFunc + '" ends in js');
      });
    });
  })
});