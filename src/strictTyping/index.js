var objectDefinitionBuilderFactory = require('../strictTyping/builder/factory.js');

module.exports.build = function() {
    var module = {
        objectDefinitions: {},
        defineStrictlyTypedObject: function(name, objectDefinitionFactory) {
            var objectDefinitionBuilder = objectDefinitionBuilderFactory.instance(name);
            objectDefinitionFactory(objectDefinitionBuilder);
            objectDefinitionBuilder.validate();
            if (typeof module.objectDefinitions[name] !== 'undefined') {
                throw "Cannot create strictly typed object definition '" + name + "' because a definition with that name already exists"
            }
            module.objectDefinitions[name] = objectDefinitionBuilder.build();
        },
        validateObjectIsOfType: function(obj, nameOfStrictlyTypedObject) {
            if (!module.objectDefinitions[nameOfStrictlyTypedObject]) {
                throw 'No such strictly typed object "' + nameOfStrictlyTypedObject + '"';
            }
            try {
                require('./validator/validator.js').validate(module.objectDefinitions[nameOfStrictlyTypedObject], obj, module.objectDefinitions);
            } catch (validationException) {
                throw 'Error creating object of type "' + nameOfStrictlyTypedObject + '": ' + validationException;
            }
        }
    }
    
    module.defineStrictlyTypedObject('CustomVariableType', require('../strictTyping/objectDefinitions/CustomVariableType.js'));
    module.defineStrictlyTypedObject('DomMapping', require('../strictTyping/objectDefinitions/DomMapping.js'));
    module.defineStrictlyTypedObject('EventVariables', require('../strictTyping/objectDefinitions/EventVariables.js'));
    module.defineStrictlyTypedObject('VariableTypeDefinitions', require('../strictTyping/objectDefinitions/VariableTypeDefinitions.js'));
    module.defineStrictlyTypedObject('Scenario', require('../strictTyping/objectDefinitions/Scenario.js'));
    module.defineStrictlyTypedObject('EventContext', require('../strictTyping/objectDefinitions/EventContext.js'));
    module.defineStrictlyTypedObject('Event', require('../strictTyping/objectDefinitions/Event.js'));
    module.defineStrictlyTypedObject('DomElementDefinition', require('../strictTyping/objectDefinitions/DomElementDefinition.js'));
    module.defineStrictlyTypedObject('Location', require('../strictTyping/objectDefinitions/Location.js'));
    module.defineStrictlyTypedObject('ThisDotEvent', require('../strictTyping/objectDefinitions/ThisDotEvent.js'));
    
    return module;
}