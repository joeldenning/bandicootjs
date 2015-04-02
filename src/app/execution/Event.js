var _ = require('lodash');

module.exports = function(bandicoot, eventName, domArgs) {
  var event = bandicoot.library.slashNamespacing.getValueFromNamespacedObject(bandicoot.app.Events, eventName);
  if (!event) {
    throw "No such event '" + eventName + "' in bandicoot.app.Events object. Event names are of namespaced with slash (/) characters."; 
  }

  var location = bandicoot.library.slashNamespacing.getValueFromNamespacedObject(bandicoot.app.Locations, event.location);

  if (!location) {
    throw "No such location '" + event.location + "' in bandicoot.app.Locations object.";
  }

  var possibleScenarios;
  if (bandicoot.app.Scenarios[event.location] && bandicoot.app.Scenarios[event.location][event.event]) {
    possibleScenarios = bandicoot.app.Scenarios[event.location][event.event];
  } else {
    console.log('No possible scenarios for ' + bandicoot.app.EventPrototype.getFullyQualifiedName(event));
    return;    
  }

  var domVariables = bandicoot.library.domMapping.extractToVariables(location.location);
  if (location.this.dom) {
    if (_.size(location.this.dom) > 0 && _.size(domVariables.dom) === 0) {
      throw "No location '" + location.location + "' was found in the dom";
    }
    try {
      bandicoot.library.domMapping.verifyTypes(location.this.dom, location.types, domVariables.dom);
    } catch (ex) {
      throw "Error mapping DOM location '" + location.location + "' to the javascript location of the same name -- " + ex;
    }
  }

  if (location.this.buildingBlocks) {
    if (_.size(location.this.buildingBlocks) > 0 && _.size(domVariables.buildingBlocks) === 0) {
      throw "No location '" + location.location + "' was found in building blocks";
    }
    try {
      bandicoot.library.domMapping.verifyTypes(location.this.buildingBlocks, location.types, domVariables.buildingBlocks);
    } catch (ex) {
      throw "Error mapping building blocks for location '" + location.location + "' to the javascript location of the same name -- " + ex;
    }
  }

  var scenarioArgs = {};
  _.assign(scenarioArgs, domVariables);

  if (event.this) {
    if (!domArgs) {
      throw "The dom event arguments were not passed into the function -- cannot create 'this.event'";
    }
    scenarioArgs.event = {
      source: bandicoot.library.domEvents.findDOMElFromDomArgs(domArgs, domVariables, location.location)
    };
    try {
      bandicoot.library.domMapping.verifyTypes(event.this, undefined, scenarioArgs.event);
    } catch (ex) {
      "Error mapping the 'this' property for event '" + event.event + "' to the actual dom event -- " + ex;
    }
  }

  var scenariosToExecute = [];

  Object.keys(possibleScenarios).forEach(function(possibleScenarioName) {
    var possibleScenario = possibleScenarios[possibleScenarioName];

    var args = _.cloneDeep(scenarioArgs, bandicoot.library.cloneDeep.lodashCustomizer);
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

  if (scenariosToExecute.length === 0) {
    console.log("No scenario conditions were met");
  }

  var scenarioDomState = {};

  var atLeastOneScenarioSucceeded = false;
  scenariosToExecute.forEach(function(scenario) {
    try {
      var args = _.cloneDeep(scenarioArgs, bandicoot.library.cloneDeep.lodashCustomizer);
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