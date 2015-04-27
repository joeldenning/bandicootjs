module.exports = function(objectDefinitionBuilder) {
  objectDefinitionBuilder.addProperty('event').withType('strictlyTypedObject', 'EventInjectEvent');

  objectDefinitionBuilder.requireProperty('event');
}