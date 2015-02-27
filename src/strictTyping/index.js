var objectDefinitionBuilderFactory = require('../strictTyping/builder/factory.js');

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
    
    module.defineStrictlyTypedObject('DomEvent', require('../strictTyping/objectDefinitions/DomEvent.js'));
    
    return module;
}