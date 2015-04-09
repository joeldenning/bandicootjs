module.exports.build = function() {
  var elementDefinitions = {};
  var inputDefinition = require('./definitions/input.js');
  module.exports.dependencies.strictTyping.validateObjectIsOfType(inputDefinition, 'DomElementDefinition');
  elementDefinitions[inputDefinition.tagName] = inputDefinition;
  return elementDefinitions;
}