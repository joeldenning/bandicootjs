var app = require('../index.js');
var _ = app.dependencies.lodash;

module.exports = function(input, domArgs) {
  var EventPrototype = require('../prototype/Event.js');
  var ScenarioPrototype = require('../prototype/Scenario.js');

  if (typeof input === 'string') {
    triggerEvent(input, domArgs);
  } else {
    app.dependencies.strictTyping.validateObjectIsOfType(input, 'Event');
    var event = input;
    var fullyQualifiedName = EventPrototype.getFullyQualifiedName(event);
    if (typeof EventPrototype[fullyQualifiedName] !== 'undefined') {
      throw 'Event with name "' + fullyQualifiedName + "' already exists";
    }
    app.dependencies.slashNamespacing.addPropertyToObjectFromSlashNamespacedName(app.Events, fullyQualifiedName, event);
  }
};

function triggerEvent(eventName, domArgs) {
  var app = require('../index.js');
  var EventPrototype = require('../prototype/Event.js');
  var ScenarioPrototype = require('../prototype/Scenario.js');
  var applicationArgsCreator = require('../applicationArgsCreator.js');

  var event = app.dependencies.slashNamespacing.getValueFromNamespacedObject(app.Events, eventName);
  if (!event) {
    throw "No such event '" + eventName + "' in bandicoot.app.Events object. Event names are of namespaced with slash (/) characters."; 
  }

  var location = app.dependencies.slashNamespacing.getValueFromNamespacedObject(app.Locations, event.location);

  if (!location) {
    throw "No such location '" + event.location + "' in bandicoot.app.Locations object.";
  }

  var possibleScenarios;
  if (app.Scenarios[event.location] && app.Scenarios[event.location][event.event]) {
    possibleScenarios = app.Scenarios[event.location][event.event];
  } else {
    console.log('No possible scenarios for ' + EventPrototype.getFullyQualifiedName(event));
    return;    
  }

  var domVariables = app.dependencies.domMapping.extractToVariables(location.location);
  if (location.this.dom) {
    if (_.size(location.this.dom) > 0 && _.size(domVariables.dom) === 0) {
      throw "No location '" + location.location + "' was found in the dom";
    }
    try {
      app.dependencies.domMapping.verifyTypes(location.this.dom, location.types, domVariables.dom);
    } catch (ex) {
      throw "Error mapping DOM location '" + location.location + "' to the javascript location of the same name -- " + ex;
    }
  }

  if (location.this.buildingBlocks) {
    if (_.size(location.this.buildingBlocks) > 0 && _.size(domVariables.buildingBlocks) === 0) {
      throw "No location '" + location.location + "' was found in building blocks";
    }
    try {
      app.dependencies.domMapping.verifyTypes(location.this.buildingBlocks, location.types, domVariables.buildingBlocks);
    } catch (ex) {
      throw "Error mapping building blocks for location '" + location.location + "' to the javascript location of the same name -- " + ex;
    }
  }

  var eventSourcePath;
  var eventSourceDomElement;

  if (event.this) {
    if (!domArgs) {
      throw "The dom event arguments were not passed into the function -- cannot create 'this.event'";
    }

    try {
      app.dependencies.domMapping.verifyTypes(event.this, undefined, eventVariables.event);
    } catch (ex) {
      "Error mapping the 'this' property for event '" + event.event + "' to the actual dom event -- " + ex;
    }

    if (event.this.event.source) {
      eventSourceDomElement = app.dependencies.domEvents.getEventSourceDomElement(domArgs);
      eventSourcePath = app.dependencies.domMapping.reverseEngineerPathToElement(eventSourceDomElement);
    }
  }

  var keyboardEvent;
  if (domArgs.length === 1 && (domArgs[0].type === 'keydown' || domArgs[0].type === 'keyup')) {
    keyboardEvent = domArgs[0];
  }

  var applicationArgs = applicationArgsCreator(domVariables, eventSourcePath, eventSourceDomElement, keyboardEvent);

  if (event.condition) {
    var args = app.dependencies.cloneDeep(applicationArgs);
    var eventConditionMet = event.condition.apply(args);
    if (eventConditionMet !== true) {
      console.log("Event condition was not met");
      return;
    }
  }

  var scenariosToExecute = [];

  Object.keys(possibleScenarios).forEach(function(possibleScenarioName) {
    var possibleScenario = possibleScenarios[possibleScenarioName];
    var args = app.dependencies.cloneDeep(applicationArgs);

    var booleanExpressionResult;
    try {
      booleanExpressionResult = possibleScenario.condition.apply(args);
    } catch (ex) {
      console.log("Scenario '" + EventPrototype.getFullyQualifiedName(possibleScenario) 
        + "' threw an error during evaluation of the 'condition' expression -- " + ex.stack);
    }
    if (booleanExpressionResult === true) {
      scenariosToExecute.push(possibleScenario);
    }
  });

  if (scenariosToExecute.length === 0) {
    console.log("No scenario conditions were met");
  }

  app.nextAvailableScenarioWorker(function(scenarioWorker) {
    
    scenarioWorker.postMessage({
      command: 'executeScenarios',
      applicationArgs: app.dependencies.cloneDeep(applicationArgs),
      scenarios: scenariosToExecute
    });

    scenarioWorker.onmessage = function(e) {
      if (e.data.atLeastOneScenarioSucceeded) {
        var newDomState = app.dependencies.domPatching.calculateDesiredDomState(domVariables.dom, scenarioDomState);
        app.dependencies.domPatching.patchDom(event.location, domVariables.dom, newDomState);
      }

      app.workerComplete(scenarioWorker);
    };

    scenarioWorker.onerror = function(e) {
      app.workerComplete(scenarioWorker);
      throw e;
    }
  });
};