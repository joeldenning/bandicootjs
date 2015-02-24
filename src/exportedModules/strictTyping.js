var fs = require('fs')
var moduleDirPath = __dirname + '/../strictTyping/'
var objectDefinitionsPath = moduleDirPath + 'objectDefinitions/'
var objectDefinitionBuilderFactory = require(moduleDirPath + 'objectDefinitionBuilderFactory.js')

module.exports.build = function() {
    var module = {
        objectDefinitions: {},
        defineStrictlyTypedObject: function(name, objectDefinitionFactory) {
            var objectDefinitionBuilder = objectDefinitionBuilderFactory.instance();
            objectDefinitionFactory(objectDefinitionBuilder);
            objectDefinitionBuilder.validate();
            if (typeof module.objectDefinitions[name] !== 'undefined') {
                throw "Cannot create strictly typed object definition '" + name + "' because a definition with that name already exists"
            }
            module.objectDefinitions[name] = objectDefinitionBuilder.build()
        }
    }
    
    fs.readdirSync(objectDefinitionsPath).forEach(function(objectDefinitionFileName) {
        var objectDefinitionFactory = require(objectDefinitionsPath + objectDefinitionFileName)
        var objectDefinitionName = objectDefinitionFileName.substr(0, objectDefinitionFileName.length-3);
        module.defineStrictlyTypedObject(objectDefinitionName, objectDefinitionFactory)
    })
    
    return module;
}