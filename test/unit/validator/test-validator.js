var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

describe('Strict Typing validator', function() {
  var validator = require(process.cwd() + '/src/strictTyping/validator/validator.js');
  var definition, validObject, invalidObject;

  describe('string property', function() {
    beforeEach(function() {
      definition = {
        properties: {
          testproperty: {
            name: 'testproperty',
            required: true,
            withType: 'string',
            matchingPattern: /pattern/
          }
        }
      };
    });
  });

  describe('condition expression string validation', function() {
    beforeEach(function() {
      definition = {
        properties: {
          testproperty: {
            name: 'testproperty',
            required: true,
            withType: 'conditionalExpressionString'
          }
        }
      };

      validObject = {
        testproperty: 'true === true'
      };

      invalidObject = {
      };
    })

    it('allows simple boolean expressions', function() {
      validator.validate(definition, validObject);
    });

    it('does not allow empty conditional expressions', function() {
      invalidObject.testproperty = '';
      expect(function() { validator.validate(definition, invalidObject) }).to.throw(/non-empty string/);
    });

    it('does not allow syntax errors', function() {
      invalidObject.testproperty = 'true ==== true';
      expect(function() { validator.validate(definition, invalidObject) }).to.throw(/Failed to parse conditional expression. Esprima parse error/);
    })

    it('does not allow function definitions', function() {
      invalidObject.testproperty = 'function jokeIsOnYou() { console.log("here"); }';
      expect(function() { validator.validate(definition, invalidObject) }).to.throw(/must be a boolean expression/);
    });

    it('does not allow multiple conditional expressions', function() {
      invalidObject.testproperty = 'true == true; false == false';
      expect(function() { validator.validate(definition, invalidObject) }).to.throw(/single conditional expression/);
    });

    it('does not allow variable assignments', function() {
      invalidObject.testproperty = 'var joel = 1;';
      expect(function() { validator.validate(definition, invalidObject) }).to.throw(/must be a boolean expression/);
    })
  });
});