var evaluate = require('static-eval');
var esprima = require('esprima');
var _ = require('lodash');

module.exports = function(bandicoot, eventName) {
  var event = bandicoot.library.slashNamespacing.getValueFromNamespacedObject(bandicoot.app.Events, eventName);
  if (!event) {
    throw "No such event '" + eventName + "' in bandicoot.app.Events object. Event names are of namespaced with slash (/) characters."; 
  }

  var possibleScenarios;
  if (bandicoot.app.Scenarios[event.where] && bandicoot.app.Scenarios[event.where][event.what]) {
    possibleScenarios = bandicoot.app.Scenarios[event.where][event.what];
  } else {
    console.log('No possible scenarios for ' + bandicoot.app.EventPrototype.getFullyQualifiedName(event));
    return;    
  }

  var domVariables = bandicoot.library.domMapping.extractToVariables(event.where);
  if (event.this.dom) {
    if (_.size(event.this.dom) > 0 && _.size(domVariables.dom) === 0) {
      throw "No scope '" + event.where + "' was found in the dom";
    }
    bandicoot.library.domMapping.verifyTypes(event.this.dom, event.types, domVariables.dom);
  }

  if (event.this.buildingBlocks) {
    if (_.size(event.this.buildingBlocks) > 0 && _.size(domVariables.buildingBlocks) === 0) {
      throw "No scope '" + event.where + "' was found in building blocks";
    }
    bandicoot.library.domMapping.verifyTypes(event.this.buildingBlocks, event.types, domVariables.buildingBlocks);
  }

  var scenarioArgs = {};
  _.assign(scenarioArgs, domVariables);

  var scenariosToExecute = [];

  Object.keys(possibleScenarios).forEach(function(possibleScenarioName) {
    var possibleScenario = possibleScenarios[possibleScenarioName];
    var booleanExpression = esprima.parse(possibleScenario.when).body[0].expression;

    var booleanExpressionResult;
    try {
      booleanExpressionResult = evaluate(booleanExpression, {}, scenarioArgs);
    } catch (ex) {
      console.log("Scenario '" + bandicoot.app.EventPrototype.getFullyQualifiedName(possibleScenario) 
        + "' threw an error during evaluation of the 'when' expression -- " + ex.stack);
    }
    if (booleanExpressionResult === true) {
      scenariosToExecute.push(possibleScenario);
    }
  });

  scenariosToExecute.forEach(function(scenario) {
    try {
      scenario.how.call(scenarioArgs);
    } catch (ex) {
      console.log('Scenario "' + bandicoot.app.ScenarioPrototype.getFullyQualifiedName(scenario) + '" failed with error -- ' + ex.stack);
    }
  });

};