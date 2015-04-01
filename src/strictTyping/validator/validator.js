var lodash = require('lodash');

function validateProperty(property, object, otherTypes) {
  switch(property.withType) {
    case 'object':
    break;
    case 'array':
    break;
    case 'string':
      if (lodash.isRegExp(property.matchingPattern)) {
        if (lodash.isUndefined(object[property.name])) {
          throw 'Missing property "' + property.name + '"';
        }
        var string = object[property.name];
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
};

module.exports.validate = function(definition, object, otherTypes) {
  var keys = Object.keys(definition.properties);
  keys.forEach(function(key) {
    var property = definition.properties[key];
    if (lodash.isUndefined(object[property.name]) && property.required === true) {
      throw 'Required property "' + property.name + '" is not present';
    }
    validateProperty(property, object, otherTypes);    
  });

  if (definition.defaultProperty) {
    Object.keys(object).forEach(function(objectKey) {
      if (!definition.properties[objectKey]) {
        var property = {
          name: objectKey
        };
        lodash.assign(property, definition.defaultProperty);
        validateProperty(property, object, otherTypes);        
      }
    });
  }
};