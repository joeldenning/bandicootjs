console.log('I\'m a web worker!');

var applicationArgs, scenarios;

function executeScenarios() {
  var scenarioDomState = {};

  //we iterate through the scenarios randomly so that no one depends on scenario execution order.
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  var indicesLeft = [];
  for (var i=0; i<scenarios.length; i++) {
    indicesLeft.push(i);
  }

  var atLeastOneScenarioSucceeded = false;

  while (indicesLeft.length > 0) {
    var randomIndexOfIndex = getRandomInt(0, indicesLeft.length);
    var randomIndex = indicesLeft[randomIndexOfIndex];
    indicesLeft.splice(randomIndexOfIndex, 1);

    var scenario = scenarios[randomIndex];
    try {
      scenario.outcome.call(applicationArgs);
      scenarioDomState[ScenarioPrototype.getFullyQualifiedName(scenario)] = applicationArgs.dom;
      atLeastOneScenarioSucceeded = true;
    } catch (ex) {
      console.log('Scenario "' + ScenarioPrototype.getFullyQualifiedName(scenario) + '" failed with error -- ' + ex.stack);
    }
  }

  postMessage({
    atLeastOneScenarioSucceeded: atLeastOneScenarioSucceeded
  });
}

onmessage = function(e) {
  switch (e.data.command) {
    case 'initialize':
    break;
    case 'executeScenarios':
      applicationArgs = e.data.applicationArgs;
      scenarios = e.data.scenarios;

      if (!applicationArgs) {
        throw "Cannot execute scenarios like the main thread wants -- no applicationArgs available to worker thread";
      }

      if (!scenarios) {
        throw "Cannot execute scenarios like the main thread wants -- no scenarios available to worker thread";
      }

      executeScenarios();
    break;
  }
};