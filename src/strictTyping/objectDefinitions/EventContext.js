module.exports = function(objectDefinitionBuilder) {
  objectDefinitionBuilder.addProperty('event').withType('strictlyTypedObject', 'ThisDotEvent');

  objectDefinitionBuilder.requireProperty('event');
}