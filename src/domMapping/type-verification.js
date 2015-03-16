var _ = require('lodash');

function validateMapping(domMapping, customTypes, object) {
  for (var propertyName in domMapping) {
    var propertyType = domMapping[propertyName];
    validateProperty(propertyType, propertyName, object[propertyName], customTypes);
  }
};

function validateProperty(propertyType, propertyName, propertyValue, customTypes) {
  if (_.isUndefined(propertyValue)) {
    throw "Required property '" + propertyName + "' is not present";
  }

  var elementMatches = propertyType.match(/element<.+>/);
  var listMatches = propertyType.match(/list<.+>/);

  if (elementMatches && elementMatches.length === 1) {
    if (!_.isPlainObject(propertyValue)) {
      throw "Property '" + propertyName + "' is not an element";
    }
    var elementType = propertyType.substr(8, propertyType.length - 9);
    if (elementType.toUpperCase() !== propertyValue.tagName.toUpperCase()) {
      throw "Property '" + propertyName +  "' should be a '" + elementType.toUpperCase() + "', but is a '" + propertyValue.tagName.toUpperCase() + "'";
    }
  } else if (listMatches && listMatches.length === 1) {
    if (!_.isArray(propertyValue)) {
      throw "Property '" + propertyName + "' is not a list";
    }
    var listItemsType = propertyType.substr(5, propertyType.length - 6);
    for (var i=0; i<propertyValue.length; i++) {
      try {
        validateProperty(listItemsType, propertyName, propertyValue[i], customTypes);
      } catch (ex) {
        throw "Invalid item in list '" + propertyName + "' -- " + ex;
      }
    }
  } else {
    //custom types
    if (!customTypes[propertyType]) {
      throw "Unknown type '" + propertyType + "' for property '" + propertyName + "'";
    }
    try {
      validateMapping(customTypes[propertyName], customTypes, propertyValue);
    } catch(ex) {
      throw "Custom type '" + propertyName + "' threw a validation error -- " + ex;
    }
  }
};

module.exports = validateMapping;