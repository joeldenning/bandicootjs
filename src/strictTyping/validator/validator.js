var _ = require('../index.js').dependencies.lodash;

function validatePropertyToType(property, type, object, otherTypes) {
  switch(type) {
    case 'object':
    break;
    case 'array':
    break;
    case 'string':
      if (_.isRegExp(property.matchingPattern)) {
        if (_.isUndefined(object[property.name])) {
          throw 'Missing property "' + property.name + '"';
        }
        var string = object[property.name];
        if (!_.isString(string)) {
          throw "Property '" + property.name + "' is not a string";
        }
        if (!string.match(property.matchingPattern)) {
          throw 'String property "' + property.name + '" does not match pattern "' + property.matchingPattern + '". Property value was ' + string;
        }
      }
    break; 
    case 'function':
    break;
    case 'strictlyTypedObject':
      if (!otherTypes[property.strictlyTypedObject]) {
        throw 'No such strictlyTypedObject "' + property.strictlyTypedObject + '"';
      }
      try {
        module.exports.validate(otherTypes[property.strictlyTypedObject], object[property.name], otherTypes);
      } catch (ex) {
        throw ex + ' for property "' + property.name + '" (of type "' + property.strictlyTypedObject + '")';
      }
    break;
  }
}

function validateProperty(property, object, otherTypes) {
  try {
    validatePropertyToType(property, property.withType, object, otherTypes);
  } catch(withTypeEx) {
    if (property.orWithType) {
      try {
        validatePropertyToType(property, property.orWithType, object, otherTypes);
      } catch (orWithTypeEx) {
        throw property.name + " is neither of type '" + property.withType + "' (exception: " +
          withTypeEx + "), nor of type '" + property.orWithType + "' (exception: " + orWithTypeEx + ")";
      }
    } else {
      throw withTypeEx;
    }
  }
};

module.exports.validate = function(definition, object, otherTypes) {
  var keys = Object.keys(definition.properties);
  keys.forEach(function(key) {
    var property = definition.properties[key];
    if (_.isUndefined(object[property.name]) && property.required === true) {
      throw 'Required property "' + property.name + '" is not present';
    }
    if (property.required === true || object[key]) {
      validateProperty(property, object, otherTypes); 
    }   
  });

  if (definition.defaultProperty) {
    Object.keys(object).forEach(function(objectKey) {
      if (!definition.properties[objectKey]) {
        var property = {
          name: objectKey
        };
        _.assign(property, definition.defaultProperty);
        validateProperty(property, object, otherTypes);        
      }
    });
  }
};