module.exports = function(objectDefinitionBuilder) {
  var noSlashesPattern = /[^\/]/
  objectDefinitionBuilder.addProperty('$scope').withType('string').matchingPattern(noSlashesPattern);
  objectDefinitionBuilder.allRemainingProperties().withType('string');
};