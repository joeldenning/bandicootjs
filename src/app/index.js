var _ = require('lodash');

module.exports.build = function(cloneDeep, domElements, domEvents, domMapping, domPatching, slashNamespacing, strictTyping) {
  module.exports.dependencies = {
    cloneDeep: cloneDeep,
    domElements: domElements,
    domEvents: domEvents,
    domMapping: domMapping,
    domPatching: domPatching,
    slashNamespacing: slashNamespacing,
    strictTyping: strictTyping
  };

  module.exports.Locations = {};
  module.exports.Events = {};
  module.exports.Scenarios = {};

  return {
    app: {
      Locations: module.exports.Locations,
      LocationPrototype: require('./prototype/Location.js'),
      Events: module.exports.Events,
      EventPrototype: require('./prototype/Event.js'),
      Scenarios: module.exports.Scenarios,
      ScenarioPrototype: require('./prototype/Scenario.js'),
    },
    Location: require('./execution/Location.js'),
    Event: require('./execution/Event.js'),
    Scenario: require('./execution/Scenario.js'),
  };
};