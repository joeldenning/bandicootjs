var lodash = require('lodash');

var funcs = {};

funcs.matchingPattern = function(property, pattern) {
  if (Object.prototype.toString.call(pattern).indexOf('RegExp') >= 0) {
    property.matchingPattern = pattern;
  }
}

funcs.whereEachPropertyIs = function(property, propertyType) {
  if (propertyType === 'string') {
    property.matchingPattern = function(pattern) {
      funcs.matchingPattern(property, pattern);
    }
  }
  property.whereEachPropertyIs = propertyType
  return property;
}

funcs.whereEachElementIs = function(property, elementType) {
  if (elementType === 'string') {
    property.matchingPattern = function(pattern) {
      funcs.matchingPattern(property, pattern);
    }
  }
  property.whereEachElementIs = elementType;
  return property;
}

funcs.withType = function(property, type) {
  switch(type) {
    case 'object':
      property.whereEachPropertyIs = lodash.bind(funcs.whereEachPropertyIs, null, property);
    break;
    case 'array':
      property.whereEachElementIs = lodash.bind(funcs.whereEachElementIs, null, property);
    break;
    case 'string':
      property.matchingPattern = lodash.bind(funcs.matchingPattern, null, property);
    break;
    case 'conditionalExpressionString':
    break;
    case 'function':
    break;
    default:
      throw 'When building property "' + property.name + '", there is no such type "' + type + '"';
    break;
  }
  property.withType = type;
  return property;
}

module.exports = {
  instance: function(name) {
    var builder = {
      properties: {},
      name: name,
      addProperty: function(name) {
        if (typeof builder.properties[name] !== 'undefined') {
          throw "Cannot add property '" + name + "' because a property with that name already exists";
        }
        var property = {
          name: name,
          withType: function(type) {
            return funcs.withType(property, type);
          }
        };
        builder.properties[name] = property;
        return property;
      },
      requireProperty: function(name) {
        if (!lodash.isPlainObject(builder.properties[name])) {
          throw 'Cannot require property "' + name + '" because no such property exists';
        }
        builder.properties[name].required = true;
      },
      validate: function() {
        var keys = Object.keys(builder.properties);
        keys.forEach(function(key) {
          var property = builder.properties[key];
          if (typeof property.name !== 'string') {
            throw "One or more properties do not have a name";
          }
          if (typeof property.withType !== 'string') {
            throw "Property '" + property.name + "' does not have an associated type";
          }
        });
      },
      build: function() {
        return builder.properties;
      }
    }
    return builder;
  }
}