module.exports.build = function(strictTyping) {
  var elementDefinitions = {};
  var inputDefinition = require('./elements/input.js');
  strictTyping.validateObjectIsOfType(inputDefinition, 'DomElementDefinition');
  elementDefinitions[inputDefinition.tagName] = inputDefinition;

  return {
    extractToVariables: function(scope) {
      return require('./dom-extraction.js')(elementDefinitions, scope);
    },
    verifyTypes: require('./type-verification.js')
  };
};