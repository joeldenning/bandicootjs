var _ = require('lodash');

module.exports = function(input) {
  var app = require('../index.js');
  var LocationPrototype = require('../prototype/Location.js');

  try {
    app.dependencies.strictTyping.validateObjectIsOfType(input, 'Location');
  } catch (ex) {
    throw "Error creating Location with name '" + input.location + "': " + ex;
  }
  var location = input;
  var fullyQualifiedName = LocationPrototype.getFullyQualifiedName(location);
  if (!_.isUndefined(app.Locations[fullyQualifiedName])) {
    throw 'Location with name "' + fullyQualifiedName + "' already exists";
  }

  app.dependencies.slashNamespacing.addPropertyToObjectFromSlashNamespacedName(app.Locations, fullyQualifiedName, location);
}