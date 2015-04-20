var fs = require('fs');

module.exports.build = function() {
  module.exports.Locations = {};
  module.exports.Events = {};
  module.exports.Scenarios = {};
  
  var scenarioWorkers = [];
  var funcsWaitingForScenarioWorkers = [];
  var ScenarioPrototype = require('./prototype/Scenario.js');
  var scenarioWorkerAsString = fs.readFileSync(__dirname + '/webworker/scenarioWorker.js');

  for (var i=0; i<8; i++) {
    var scenarioWorker = module.exports.dependencies.webworker.workerFromString(scenarioWorkerAsString);
    scenarioWorkers.push(scenarioWorker);
  }

  module.exports.nextAvailableScenarioWorker = function(callback) {
    if (scenarioWorkers.length > 0) {
      callback(scenarioWorkers.splice(0, 1)[0]);
    } else {
      funcsWaitingForScenarioWorkers.push(callback);
    }
  };

  module.exports.workerComplete = function(worker) {
    if (funcsWaitingForScenarioWorkers.length === 0) {
      scenarioWorkers.push(worker);
    } else {
      funcsWaitingForScenarioWorkers.splice(0, 1)[0](worker);
    }
  };

  return {
    app: {
      Locations: module.exports.Locations,
      LocationPrototype: require('./prototype/Location.js'),
      Events: module.exports.Events,
      EventPrototype: require('./prototype/Event.js'),
      Scenarios: module.exports.Scenarios,
      ScenarioPrototype: ScenarioPrototype,
    },
    Location: require('./execution/Location.js'),
    Event: require('./execution/Event.js'),
    Scenario: require('./execution/Scenario.js'),
  };
};