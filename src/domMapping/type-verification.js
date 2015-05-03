var _ = require('./index.js').dependencies.lodash;

function validateMapping(domMapping, customTypes, object) {
  if (_.isUndefined(object)) {
    throw "Cannot validate an undefined object";
  }

  if (_.isString(domMapping)) {
    validateStringProperty(domMapping, '[root property]', object, customTypes);
  } else {
    //domMapping should be an object
    for (var propertyName in domMapping) {
      var property = domMapping[propertyName];
      if (_.isUndefined(object[propertyName])) {
        throw "Object does not have property '" + propertyName + "'";
      }
      if (_.isString(property)) {
        validateStringProperty(property, propertyName, object[propertyName], customTypes);
      } else if (_.isPlainObject(property)) {
        try {
          validateMapping(property, customTypes, object[propertyName]);
        } catch (ex) {
          throw "Error while parsing property '" + propertyName + "': " + ex;
        }
      } else {
        throw "Cannot parse properties of type '" + typeof property + "'";
      }
    }
  }
};

function validateStringProperty(propertyType, propertyName, propertyValue, customTypes) {
  var elementMatches = propertyType.match(/element<.+>/);
  var listMatches = propertyType.match(/list<.+>/);
  var tableMatches = propertyType.match(/table<.+>/);

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
        validateStringProperty(listItemsType, propertyName, propertyValue[i], customTypes);
      } catch (ex) {
        throw "Invalid item in list '" + propertyName + "' -- " + ex;
      }
    }
  } else if (tableMatches && tableMatches.length === 1) {
    if (typeof propertyValue !== 'object') {
      throw "Property '" + propertyName + "' is not a table";
    }

    var tableRowType = propertyType.substr(6, propertyType.length - 7);
    for (var i=0; i<propertyValue.length; i++) {
      try {
        validateStringProperty(tableRowType, propertyName, propertyValue[i], customTypes);
      } catch (ex) {
        throw "Invalid table-row in table '" + propertyName + "' -- " + ex;
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