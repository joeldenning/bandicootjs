module.exports.build = function() {
    var objectDefinitionBuilderFactory = require('../strictTyping/builder/factory.js');
    
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
    
    module.defineStrictlyTypedObject('ServiceInjectedType', require('../strictTyping/objectDefinitions/ServiceInjectedType.js'));
    module.defineStrictlyTypedObject('Service', require('../strictTyping/objectDefinitions/Service.js'));
    module.defineStrictlyTypedObject('CustomVariableType', require('../strictTyping/objectDefinitions/CustomVariableType.js'));
    module.defineStrictlyTypedObject('DomMapping', require('../strictTyping/objectDefinitions/DomMapping.js'));
    module.defineStrictlyTypedObject('LocationInject', require('../strictTyping/objectDefinitions/LocationInject.js'));
    module.defineStrictlyTypedObject('VariableTypeDefinitions', require('../strictTyping/objectDefinitions/VariableTypeDefinitions.js'));
    module.defineStrictlyTypedObject('ScenarioInject', require('../strictTyping/objectDefinitions/ScenarioInject.js'));
    module.defineStrictlyTypedObject('Scenario', require('../strictTyping/objectDefinitions/Scenario.js'));
    module.defineStrictlyTypedObject('EventInject', require('../strictTyping/objectDefinitions/EventInject.js'));
    module.defineStrictlyTypedObject('Event', require('../strictTyping/objectDefinitions/Event.js'));
    module.defineStrictlyTypedObject('DomElementDefinition', require('../strictTyping/objectDefinitions/DomElementDefinition.js'));
    module.defineStrictlyTypedObject('Location', require('../strictTyping/objectDefinitions/Location.js'));
    module.defineStrictlyTypedObject('EventInjectEvent', require('../strictTyping/objectDefinitions/EventInjectEvent.js'));
    
    return module;
}