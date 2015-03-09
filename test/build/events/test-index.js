var chai = require('chai').assert

describe('events module', function() {
  it('does not throw errors when built', function() {
    var bandicoot = {};
    var module = require(process.cwd() + '/src/events/index.js').build(bandicoot);
  });
})