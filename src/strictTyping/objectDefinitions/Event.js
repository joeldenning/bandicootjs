module.exports = function(objectDefinitionBuilder) {
  var noSlashesPattern = /[^\/]/;
  objectDefinitionBuilder.addProperty('location').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('event').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('owner').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('inject').withType('strictlyTypedObject', 'EventInject');

  objectDefinitionBuilder.requireProperty('owner');
  objectDefinitionBuilder.requireProperty('location');
  objectDefinitionBuilder.requireProperty('event');
};