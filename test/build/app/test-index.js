var chai = require('chai').assert

describe('app module', function() {
  it('does not throw errors when built', function() {
    var bandicoot = {};
    var module = require(process.cwd() + '/src/app/index.js').build(bandicoot);
  });
})