module.exports = function(objectDefinitionBuilder) {
    objectDefinitionBuilder.addProperty('name').withType('string').matchingPattern(/[^ ]+/)
    objectDefinitionBuilder.addProperty('description').withType('string')
    objectDefinitionBuilder.addProperty('domParameters').withType('object').whereEachPropertyIs('string').matchingPattern(/ul|li|div/)
    objectDefinitionBuilder.addProperty('services').withType('array').whereEachElementIs('string').matchingPattern(/[^ ]/)
    objectDefinitionBuilder.addProperty('respond').withType('function')
}