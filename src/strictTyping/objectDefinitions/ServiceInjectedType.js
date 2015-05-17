module.exports = function(objectDefinitionBuilder) {
  var alphanumeric = /[a-zA-z0-9]+/;
  objectDefinitionBuilder.addProperty('name').withType('string').matchingPattern(alphanumeric);
  objectDefinitionBuilder.addProperty('construct').withType('function');

  objectDefinitionBuilder.requireProperty('name');
  objectDefinitionBuilder.requireProperty('construct');
}