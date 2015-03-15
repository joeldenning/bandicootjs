var evaluate = require('static-eval');
var esprima = require('esprima');
var _ = require('lodash');

module.exports = function(bandicoot, eventName) {
  var event = bandicoot.library.slashNamespacing.getValueFromNamespacedObject(bandicoot.app.Events, eventName);
  if (!event) {
    throw "No such event " + eventName + " in bandicoot.app.Events object. Event names are of namespaced with slash (/) characters."; 
  }

  var possibleScenarios;
  if (bandicoot.app.Scenarios[event.where] && bandicoot.app.Scenarios[event.where][event.what]) {
    possibleScenarios = bandicoot.app.Scenarios[event.where][event.what];
  } else {
    console.log('no possible scenarios for ' + bandicoot.app.EventPrototype.getFullyQualifiedName(event));
    return;    
  }

  var domVariables;
  if (event.this.dom) {
    domVariables = bandicoot.library.domMapping.extractToVariables(event.this.dom, event.types);
  }

  var htmlBuildingBlocks;
  if (event.this.buildingBlocks) {
    htmlBuildingBlocks = bandicoot.library.domMapping.extractToVariables(event.this.dom, event.types);
  }

  var scenariosToExecute = [];

  var scenarioArgs = {
    dom: domVariables,
    buildingBlocks: htmlBuildingBlocks
  };

  Object.keys(possibleScenarios).forEach(function(possibleScenarioName) {
    var possibleScenario = possibleScenarios[possibleScenarioName];
    var booleanExpression = esprima.parse(possibleScenario.when).body[0].expression;
    var evalArgs = {
      this: {}
    };
    _.assign(evalArgs.this, scenarioArgs);

    var booleanExpressionResult = evaluate(booleanExpression, evalArgs);
    if (booleanExpressionResult) {
      scenariosToExecute.push(possibleScenario);
    }
  });

  scenariosToExecute.forEach(function(scenario) {
    try {
      scenario.how.call(scenarioArgs);
    } catch (ex) {
      console.log('Scenario ' + bandicoot.app.ScenarioPrototype.getFullyQualifiedName(scenario) + ' failed with error: ' + ex);
    }
  });

};