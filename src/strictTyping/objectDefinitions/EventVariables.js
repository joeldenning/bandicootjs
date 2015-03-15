module.exports = function(objectDefinitionBuilder) {
  objectDefinitionBuilder.addProperty('dom').withType('strictlyTypedObject', 'DomMapping');
  objectDefinitionBuilder.addProperty('buildingBlocks').withType('strictlyTypedObject', 'DomMapping');
};