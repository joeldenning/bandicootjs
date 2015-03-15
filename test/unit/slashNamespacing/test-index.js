var assert = require('chai').assert;
var _ = require('lodash');

describe('slashNamespacing library', function() {
  var slashNamespacing;
  before(function() {
    slashNamespacing = require(process.cwd() + '/src/slashNamespacing/index.js').build();
  });

  describe('addPropertyToObjectFromSlashNamespacedName function', function() {
    var obj;
    beforeEach(function() {
      obj = {};
    });

    it('adds first namespace as a property of root level object', function() {
      slashNamespacing.addPropertyToObjectFromSlashNamespacedName(obj, 'first/second/third', 'value');
      assert(obj.first);
    });

    it('adds all other namespaces into an object tree, with the correct value', function() {
      slashNamespacing.addPropertyToObjectFromSlashNamespacedName(obj, 'first /second/third', 'value');
      var expected = {
        'first ': {
          second: {
            third: 'value'
          }
        }
      };
      assert(_.isEqual(obj, expected));
    });
  });

  describe('getValueFromNamespacedObject function', function() {
    it('retrieves value correctly', function() {
      var obj = {
        first: {
          'sec ond': {
            third: 'value'
          }
        }
      };
      assert.equal(slashNamespacing.getValueFromNamespacedObject(obj, 'first/sec ond/third'), 'value');
    });
  });
});