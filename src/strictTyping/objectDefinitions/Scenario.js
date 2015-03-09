module.exports = function(objectDefinitionBuilder) {
  var noSlashesPattern = /[^\/]/
  objectDefinitionBuilder.addProperty('where').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('action').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('what').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.addProperty('when').withType('conditionalExpressionString');
  objectDefinitionBuilder.addProperty('how').withType('function');
  objectDefinitionBuilder.addProperty('domVariables').withType('object').whereEachPropertyIs('string').matchingPattern(/ul|li|div/)
  objectDefinitionBuilder.addProperty('domExamples').withType('object').whereEachPropertyIs('string').matchingPattern(/ul|li|div/)  
  objectDefinitionBuilder.addProperty('services').withType('array').whereEachElementIs('string').matchingPattern(/[^ ]/)

  objectDefinitionBuilder.requireProperty('where');
  objectDefinitionBuilder.requireProperty('action');
  objectDefinitionBuilder.requireProperty('what');
  objectDefinitionBuilder.requireProperty('when');
}