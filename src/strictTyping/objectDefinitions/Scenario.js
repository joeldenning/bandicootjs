module.exports = function(objectDefinitionBuilder) {
  var noSlashesPattern = /[^\/]/
  objectDefinitionBuilder.addProperty('outcome').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('location').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('event').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('when').withType('function');
  objectDefinitionBuilder.addProperty('how').withType('function');
  objectDefinitionBuilder.addProperty('domVariables').withType('object').whereEachPropertyIs('string').matchingPattern(/ul|li|div/)
  objectDefinitionBuilder.addProperty('domExamples').withType('object').whereEachPropertyIs('string').matchingPattern(/ul|li|div/)  
  objectDefinitionBuilder.addProperty('services').withType('array').whereEachElementIs('string').matchingPattern(/[^ ]/)

  objectDefinitionBuilder.requireProperty('outcome');
  objectDefinitionBuilder.requireProperty('location');
  objectDefinitionBuilder.requireProperty('event');
  objectDefinitionBuilder.requireProperty('when');
};