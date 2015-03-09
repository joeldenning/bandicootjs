var jsdom = require('jsdom');
var assert = require('chai').assert;

describe('To do example', function() {
  it('loads without error', function(finishTest) {
    jsdom.env({
      file: process.cwd() + '/example/to-do-list/todo.html',
      scripts: [process.cwd() + '/dist/bandicoot.js', process.cwd() + '/example/to-do-list/todo.js'],
      done: function(errors, window) {
        if (errors !== null) {
          console.dir(errors);
        }
        assert(errors === null, "Errors while initializing page:");
        finishTest();
      }
    });
  });
});