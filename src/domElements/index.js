module.exports.build = function(strictTyping) {
  var elementDefinitions = {};
  var inputDefinition = require('./definitions/input.js');
  strictTyping.validateObjectIsOfType(inputDefinition, 'DomElementDefinition');
  elementDefinitions[inputDefinition.tagName] = inputDefinition;
  return elementDefinitions;
}