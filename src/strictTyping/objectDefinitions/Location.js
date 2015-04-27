module.exports = function(objectDefinitionBuilder) {
  var noSlashesPattern = /[^\/]/
  objectDefinitionBuilder.addProperty('location').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('owner').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('inject').withType('strictlyTypedObject', 'LocationInject');
  objectDefinitionBuilder.addProperty('types').withType('strictlyTypedObject', 'VariableTypeDefinitions');

  objectDefinitionBuilder.requireProperty('location');
  objectDefinitionBuilder.requireProperty('inject');
  objectDefinitionBuilder.requireProperty('owner');
};