module.exports.build = function(strictTyping) {
  var elementDefinitions = {};
  var inputDefinition = require('./elements/input.js');
  strictTyping.validateObjectIsOfType(inputDefinition, 'DomElementDefinition');
  elementDefinitions[inputDefinition.tagName] = inputDefinition;

  return {
    extractToVariables: function(location) {
      return require('./dom-extraction.js')(elementDefinitions, location);
    },
    verifyTypes: require('./type-verification.js')
  };
};