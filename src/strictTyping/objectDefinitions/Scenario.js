module.exports = function(objectDefinitionBuilder) {
  var noSlashesPattern = /[^\/]/
  objectDefinitionBuilder.addProperty('outcome').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('where').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('what').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('when').withType('function');
  objectDefinitionBuilder.addProperty('how').withType('function');
  objectDefinitionBuilder.addProperty('domVariables').withType('object').whereEachPropertyIs('string').matchingPattern(/ul|li|div/)
  objectDefinitionBuilder.addProperty('domExamples').withType('object').whereEachPropertyIs('string').matchingPattern(/ul|li|div/)  
  objectDefinitionBuilder.addProperty('services').withType('array').whereEachElementIs('string').matchingPattern(/[^ ]/)

  objectDefinitionBuilder.requireProperty('outcome');
  objectDefinitionBuilder.requireProperty('where');
  objectDefinitionBuilder.requireProperty('what');
  objectDefinitionBuilder.requireProperty('when');
};