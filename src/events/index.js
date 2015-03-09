module.exports.build = function(bandicoot) {
  bandicoot.events = {
    ScenarioDefinition: require('./definition/Scenario.js'),
    Scenarios: {},
    EventDefinition: require('./definition/Event.js'),
    Events: {}
  };

  bandicoot.Scenario = function(input) {
    if (isFunctionCall(input)) {

    } else {
      bandicoot.library.strictTyping.validateObjectIsOfType(input, 'Scenario');
      var scenario = input;
      var fullyQualifiedName = bandicoot.events.ScenarioDefinition.getFullyQualifiedName(scenario);
      if (typeof bandicoot.events.Scenarios[fullyQualifiedName] !== 'undefined') {
        throw 'Event with name "' + fullyQualifiedName + "' already exists";
      }
      bandicoot.events.Scenarios[fullyQualifiedName] = scenario;
    }
  }

  bandicoot.Event = function(input) {
    if (isFunctionCall(input)) {

    } else {
      bandicoot.library.strictTyping.validateObjectIsOfType(input, 'Event');
      var event = input;
      var fullyQualifiedName = bandicoot.events.EventDefinition.getFullyQualifiedName(event);
      if (typeof bandicoot.events.EventDefinition[fullyQualifiedName] !== 'undefined') {
        throw 'Event with name "' + fullyQualifiedName + "' already exists";
      }
      bandicoot.events.Events[fullyQualifiedName] = event;
    }
  }
};

function isFunctionCall(input) {
  return typeof input === 'string';
}