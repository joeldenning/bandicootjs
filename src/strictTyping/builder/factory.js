var funcs = {};

funcs.matchingPattern = function(property, pattern) {
    if (Object.prototype.toString.call(pattern).indexOf('RegExp') >= 0) {
        property._matchingPattern = pattern;
    }
    delete property.matchingPattern;
}

funcs.whereEachPropertyIs = function(property, propertyType) {
    if (propertyType === 'string') {
        property.matchingPattern = function(pattern) {
            funcs.matchingPattern(property, pattern);
        }
    }
    property._whereEachPropertyIs = propertyType
    delete property.whereEachPropertyIs;
    return property;
}

funcs.whereEachElementIs = function(property, elementType) {
    if (elementType === 'string') {
        property.matchingPattern = function(pattern) {
            funcs.matchingPattern(property, pattern);
        }
    }
    property._whereEachElementIs = elementType;
    delete property.whereEachElementIs;
    return property;
}

funcs.withType = function(property, type) {
    if (type === 'object') {
        property.whereEachPropertyIs = function(propertyType) {
            return funcs.whereEachPropertyIs(property, propertyType);
        }
    } else if (type === 'array') {
        property.whereEachElementIs = function(elementType) {
            return funcs.whereEachElementIs(property, elementType);
        }
    } else if (type ==='string') {
        property.matchingPattern = function(pattern) {
            return funcs.matchingPattern(property, pattern);
        }
    }
    property._withType = type;
    delete property.withType;
    return property;
}

module.exports = {
    instance: function() {
        var builder = {
            properties: [],
            addProperty: function(name) {
                if (typeof builder.properties[name] !== 'undefined') {
                    throw "Cannot add property '" + name + "' because a property with that name already exists";
                }
                var property = {
                    _name: name,
                    withType: function(type) {
                        return funcs.withType(property, type);
                    }
                };
                builder.properties.push(property);
                return property;
            },
            validate: function() {
                builder.properties.forEach(function(property) {
                    if (typeof property._name !== 'string') {
                        throw "One or more properties do not have a name";
                    }
                    if (typeof property._withType !== 'string') {
                        throw "Property '" + property._name + "' does not have an associated type";
                    }
                    switch(property.withType) {
                        
                    }
                });
            },
            build: function() {
                return builder.properties;
            }
        };
        return builder;
    }
}