var chai = require('chai').assert

describe('strictTyping library', function() {
  it('does not throw errors when built', function() {
    require(process.cwd() + '/src/strictTyping/index.js').build()
  })
})