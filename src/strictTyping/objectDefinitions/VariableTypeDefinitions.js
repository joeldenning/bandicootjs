module.exports = function(objectDefinitionBuilder) {
  objectDefinitionBuilder.allRemainingProperties().withType('strictlyTypedObject', 'CustomVariableType');
};