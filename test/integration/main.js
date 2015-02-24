var assert = require('chai').assert;

describe('Bandicoot initialization', function() {
  var module, bandicoot;

  beforeEach(function() {
    var path = process.cwd() + '/src/main.js';
    delete require.cache[path];
    module = require(path);
  });

  it('does not throw any errors', function() {
    module.build();
  });

  it('returns an object with a library', function() {
    bandicoot = module.build();
    assert(typeof bandicoot.library !== 'undefined', 'bandicoot = ' + bandicoot);
  });

  it('returns library functions whose names are alphanumeric', function() {
    bandicoot = module.build();
    var libraryFuncs = Object.keys(bandicoot.library);
    libraryFuncs.forEach(function(libraryFunc) {
      assert(libraryFunc.match(/[a-zA-Z0-9]+/), libraryFunc + 'does not have an alphanumeric name');      
    });
  });

  it('returns library functions whose names do not end in js', function() {
    bandicoot = module.build();
    var libraryFuncs = Object.keys(bandicoot.library);
    libraryFuncs.forEach(function(libraryFunc) {
      assert(libraryFunc.match(/.*js/) === null, '"' + libraryFunc + '" ends in js');
    });
  });
});