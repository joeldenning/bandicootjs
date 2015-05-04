module.exports = function(objectDefinitionBuilder) {
  objectDefinitionBuilder.addProperty('services').withType('array').whereEachElementIs('string');
}