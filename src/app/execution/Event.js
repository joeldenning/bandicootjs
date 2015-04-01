var _ = require('lodash');

module.exports = function(bandicoot, eventName) {
  var event = bandicoot.library.slashNamespacing.getValueFromNamespacedObject(bandicoot.app.Events, eventName);
  if (!event) {
    throw "No such event '" + eventName + "' in bandicoot.app.Events object. Event names are of namespaced with slash (/) characters."; 
  }

  var possibleScenarios;
  if (bandicoot.app.Scenarios[event.location] && bandicoot.app.Scenarios[event.location][event.event]) {
    possibleScenarios = bandicoot.app.Scenarios[event.location][event.event];
  } else {
    console.log('No possible scenarios for ' + bandicoot.app.EventPrototype.getFullyQualifiedName(event));
    return;    
  }

  var domVariables = bandicoot.library.domMapping.extractToVariables(event.location);
  if (event.this.dom) {
    if (_.size(event.this.dom) > 0 && _.size(domVariables.dom) === 0) {
      throw "No location '" + event.location + "' was found in the dom";
    }
    bandicoot.library.domMapping.verifyTypes(event.this.dom, event.types, domVariables.dom);
  }

  if (event.this.buildingBlocks) {
    if (_.size(event.this.buildingBlocks) > 0 && _.size(domVariables.buildingBlocks) === 0) {
      throw "No location '" + event.location + "' was found in building blocks";
    }
    bandicoot.library.domMapping.verifyTypes(event.this.buildingBlocks, event.types, domVariables.buildingBlocks);
  }

  var scenarioArgs = {};
  _.assign(scenarioArgs, domVariables);

  var scenariosToExecute = [];

  Object.keys(possibleScenarios).forEach(function(possibleScenarioName) {
    var possibleScenario = possibleScenarios[possibleScenarioName];

    var args = _.cloneDeep(scenarioArgs, require('../../domMapping/cloneDeep-customizer.js'));
    var booleanExpressionResult;
    try {
      booleanExpressionResult = possibleScenario.condition.apply(args);
    } catch (ex) {
      console.log("Scenario '" + bandicoot.app.EventPrototype.getFullyQualifiedName(possibleScenario) 
        + "' threw an error during evaluation of the 'condition' expression -- " + ex.stack);
    }
    if (booleanExpressionResult === true) {
      scenariosToExecute.push(possibleScenario);
    }
  });

  var scenarioDomState = {};

  var atLeastOneScenarioSucceeded = false;
  scenariosToExecute.forEach(function(scenario) {
    try {
      var args = _.cloneDeep(scenarioArgs, require('../../domMapping/cloneDeep-customizer.js'))
      scenario.outcome.call(args);
      scenarioDomState[bandicoot.app.ScenarioPrototype.getFullyQualifiedName(scenario)] = args.dom;
      atLeastOneScenarioSucceeded = true;
    } catch (ex) {
      console.log('Scenario "' + bandicoot.app.ScenarioPrototype.getFullyQualifiedName(scenario) + '" failed with error -- ' + ex.stack);
    }
  });

  if (atLeastOneScenarioSucceeded) {
    var newDomState = bandicoot.library.domPatching.calculateDesiredDomState(scenarioArgs.dom, scenarioDomState);
    bandicoot.library.domPatching.patchDom(event.location, domVariables.dom, newDomState);
  }

};