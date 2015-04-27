module.exports = function(objectDefinitionBuilder) {
  objectDefinitionBuilder.addProperty('source').withType('string');

  objectDefinitionBuilder.requireProperty('source');
}