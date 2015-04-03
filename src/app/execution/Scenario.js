module.exports = function(input, Scenarios) {
  var app = require('../index.js');
  var ScenarioPrototype = require('../prototype/Scenario.js');

  if (typeof input === 'string') {
    throw 'You cannot invoke a Scenario directly. Instead you must invoke the corresponding Event for that scenario';
  } else {
    app.dependencies.strictTyping.validateObjectIsOfType(input, 'Scenario');
    var scenario = input;
    var fullyQualifiedName = ScenarioPrototype.getFullyQualifiedName(scenario);
    if (typeof app.Scenarios[fullyQualifiedName] !== 'undefined') {
      throw 'Event with name "' + fullyQualifiedName + "' already exists";
    }
    app.dependencies.slashNamespacing.addPropertyToObjectFromSlashNamespacedName(app.Scenarios, fullyQualifiedName, scenario);
  }
}