module.exports = function(objectDefinitionBuilder) {
  var noSlashesPattern = /[^\/]/
  objectDefinitionBuilder.addProperty('where').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('what').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('this').withType('strictlyTypedObject', 'EventVariables');
  objectDefinitionBuilder.addProperty('types').withType('strictlyTypedObject', 'VariableTypeDefinitions');

  objectDefinitionBuilder.requireProperty('where');
  objectDefinitionBuilder.requireProperty('what');
  objectDefinitionBuilder.requireProperty('this');
};