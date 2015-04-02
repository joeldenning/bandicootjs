var _ = require('lodash');

module.exports.build = function(bandicoot) {
  bandicoot.app = {
    Locations: {},
    LocationPrototype: require('./prototype/Location.js'),
    Scenarios: {},
    ScenarioPrototype: require('./prototype/Scenario.js'),
    Events: {},
    EventPrototype: require('./prototype/Event.js'),
    EventExecution: require('./execution/Event.js')
  };

  bandicoot.Location = function(input) {
    try {
      bandicoot.library.strictTyping.validateObjectIsOfType(input, 'Location');
    } catch (ex) {
      throw "Error creating Location with name '" + input.location + "': " + ex;
    }
    var location = input;
    var fullyQualifiedName = bandicoot.app.LocationPrototype.getFullyQualifiedName(location);
    if (!_.isUndefined(bandicoot.app.Locations[fullyQualifiedName])) {
      throw 'Location with name "' + fullyQualifiedName + "' already exists";
    }
    bandicoot.library.slashNamespacing.addPropertyToObjectFromSlashNamespacedName(bandicoot.app.Locations, fullyQualifiedName, location);
  }

  bandicoot.Scenario = function(input) {
    if (isFunctionCall(input)) {
      throw 'You cannot invoke a Scenario directly. Instead you must invoke the corresponding Event for that scenario';
    } else {
      bandicoot.library.strictTyping.validateObjectIsOfType(input, 'Scenario');
      var scenario = input;
      var fullyQualifiedName = bandicoot.app.ScenarioPrototype.getFullyQualifiedName(scenario);
      if (typeof bandicoot.app.Scenarios[fullyQualifiedName] !== 'undefined') {
        throw 'Event with name "' + fullyQualifiedName + "' already exists";
      }
      bandicoot.library.slashNamespacing.addPropertyToObjectFromSlashNamespacedName(bandicoot.app.Scenarios, fullyQualifiedName, scenario);
    }
  }

  bandicoot.Event = function(input, domArgs) {
    if (isFunctionCall(input)) {
      bandicoot.app.EventExecution(bandicoot, input, domArgs);
    } else {
      bandicoot.library.strictTyping.validateObjectIsOfType(input, 'Event');
      var event = input;
      var fullyQualifiedName = bandicoot.app.EventPrototype.getFullyQualifiedName(event);
      if (typeof bandicoot.app.EventPrototype[fullyQualifiedName] !== 'undefined') {
        throw 'Event with name "' + fullyQualifiedName + "' already exists";
      }
      bandicoot.library.slashNamespacing.addPropertyToObjectFromSlashNamespacedName(bandicoot.app.Events, fullyQualifiedName, event);
    }
  };
};

function isFunctionCall(input) {
  return typeof input === 'string';
}