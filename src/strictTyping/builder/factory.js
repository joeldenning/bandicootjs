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

function appendTypeProperties(property, type, arg) {
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
    case 'strictlyTypedObject':
      if (lodash.isUndefined(arg) || !lodash.isString(arg)) {
        throw 'When building property "' + property.name + '" of type "strictlyTypedObject", you must provide an additional argument specifying which strictlyTypedObject';
      }
      property.strictlyTypedObject = arg;
    break;
    default:
      throw 'When building property "' + property.name + '", there is no such type "' + type + '"';
    break;
  }
}

funcs.withType = function(property, type, arg) {
  appendTypeProperties(property, type, arg);
  property.withType = type;
  property.orWithType = function(type, arg) {
    return funcs.orWithType(property, type, arg);
  };
  return property;
}

funcs.orWithType = function(property, type, arg) {
  appendTypeProperties(property, type, arg);
  property.orWithType = type;
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
          withType: function(type, arg) {
            return funcs.withType(property, type, arg);
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
      allRemainingProperties: function() {
        var property = {
          withType: function(type, arg) {
            return funcs.withType(property, type, arg);
          }
        }
        builder.defaultProperty = property;
        return property;
      },
      build: function() {
        var builtProperties = {};
        var customizer = function(objectValue, sourceValue) {
          return lodash.isFunction(sourceValue) ? undefined : sourceValue;
        };
        lodash.assign(builtProperties, builder.properties, customizer);

        var builtDefaultProperty = {};
        lodash.assign(builtDefaultProperty, builder.defaultProperty, customizer);
        return {
          properties: builtProperties,
          defaultProperty: builtDefaultProperty
        };
      }
    }
    return builder;
  }
}