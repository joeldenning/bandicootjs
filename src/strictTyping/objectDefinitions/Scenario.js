module.exports = function(objectDefinitionBuilder) {
  var noSlashesPattern = /[^\/]/
  objectDefinitionBuilder.addProperty('scenario').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('location').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('event').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('condition').withType('function');
  objectDefinitionBuilder.addProperty('outcome').withType('function');
  objectDefinitionBuilder.addProperty('domVariables').withType('object').whereEachPropertyIs('string').matchingPattern(/ul|li|div/)
  objectDefinitionBuilder.addProperty('domExamples').withType('object').whereEachPropertyIs('string').matchingPattern(/ul|li|div/)  
  objectDefinitionBuilder.addProperty('services').withType('array').whereEachElementIs('string').matchingPattern(/[^ ]/)
  objectDefinitionBuilder.addProperty('inject').withType('strictlyTypedObject', 'ScenarioInject');

  objectDefinitionBuilder.requireProperty('scenario');
  objectDefinitionBuilder.requireProperty('location');
  objectDefinitionBuilder.requireProperty('event');
  objectDefinitionBuilder.requireProperty('condition');
  objectDefinitionBuilder.requireProperty('outcome');
};