module.exports = function(objectDefinitionBuilder) {
  var noSlashesPattern = /[^\/]/;
  objectDefinitionBuilder.addProperty('service').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('location').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('owner').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('inject').withType('strictlyTypedObject', 'ServiceInject');
  objectDefinitionBuilder.addProperty('initialize').withType('function');

  objectDefinitionBuilder.requireProperty('owner');
  objectDefinitionBuilder.requireProperty('service');
  objectDefinitionBuilder.requireProperty('location');

  objectDefinitionBuilder.allRemainingProperties().withType('function');
};