module.exports.build = function() {
  module.exports.Locations = {};
  module.exports.Events = {};
  module.exports.Scenarios = {};
  module.exports.Services = {};

  return {
    app: {
      Locations: module.exports.Locations,
      LocationPrototype: require('./prototype/Location.js'),
      Events: module.exports.Events,
      EventPrototype: require('./prototype/Event.js'),
      Scenarios: module.exports.Scenarios,
      ScenarioPrototype: require('./prototype/Scenario.js'),
      Services: module.exports.Services
    },
    Location: require('./execution/Location.js'),
    Event: require('./execution/Event.js'),
    Scenario: require('./execution/Scenario.js'),
    Services: require('./execution/Services.js')
  };
};