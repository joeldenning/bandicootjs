module.exports = function(objectDefinitionBuilder) {
  objectDefinitionBuilder.addProperty('defaultAttributeValues').withType('object');
  objectDefinitionBuilder.addProperty('tagName').withType('string').matchingPattern(/[A-Z]+/);

  objectDefinitionBuilder.requireProperty('defaultAttributeValues');
  objectDefinitionBuilder.requireProperty('tagName');
}