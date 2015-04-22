module.exports = function(objectDefinitionBuilder) {
  var noSlashesPattern = /[^\/]/;
  objectDefinitionBuilder.addProperty('location').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('event').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('owner').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('this').withType('strictlyTypedObject', 'EventContext');

  objectDefinitionBuilder.requireProperty('owner');
  objectDefinitionBuilder.requireProperty('location');
  objectDefinitionBuilder.requireProperty('event');
};