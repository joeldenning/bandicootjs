module.exports = function(objectDefinitionBuilder) {
  objectDefinitionBuilder.addProperty('defaultAttributeValues').withType('object');
  objectDefinitionBuilder.requireProperty('defaultAttributeValues');
}