var _ = require('../index.js').dependencies.lodash;

module.exports = function(input, domArgs) {
  var EventPrototype = require('../prototype/Event.js');
  var ScenarioPrototype = require('../prototype/Scenario.js');
  var app = require('../index.js');

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
    return event;
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

  if (location.owner.toLowerCase() !== event.owner.toLowerCase()) {
    throw "Location owner '" + location.owner + "' does not match the Event owner '" + event.owner + "'";
  }

  var possibleScenarios;
  if (app.Scenarios[event.location] && app.Scenarios[event.location][event.event]) {
    possibleScenarios = app.Scenarios[event.location][event.event];
  } else {
    console.log('No possible scenarios for ' + EventPrototype.getFullyQualifiedName(event));
    return;    
  }

  var domVariables = app.dependencies.domMapping.extractToVariables(location.location);
  if (location.inject.dom) {
    if (_.size(location.inject.dom) > 0 && _.size(domVariables.dom) === 0) {
      throw "No location '" + location.location + "' was found in the dom";
    }
    try {
      app.dependencies.domMapping.verifyTypes(location.inject.dom, location.types, domVariables.dom);
    } catch (ex) {
      throw "Error mapping DOM location '" + location.location + "' to the javascript location of the same name -- " + ex;
    }
  }

  if (location.inject.buildingBlocks) {
    if (_.size(location.inject.buildingBlocks) > 0 && _.size(domVariables.buildingBlocks) === 0) {
      throw "No location '" + location.location + "' was found in building blocks";
    }
    try {
      app.dependencies.domMapping.verifyTypes(location.inject.buildingBlocks, location.types, domVariables.buildingBlocks);
    } catch (ex) {
      throw "Error mapping building blocks for location '" + location.location + "' to the javascript location of the same name -- " + ex;
    }
  }

  var eventSourcePath;
  var eventSourceDomElement;

  if (event.inject) {
    if (!domArgs) {
      throw "The dom event arguments were not passed into the function -- cannot inject them";
    }

    try {
      app.dependencies.domMapping.verifyTypes(event.inject, undefined, eventVariables.event);
    } catch (ex) {
      "Error injecting the 'dom' property for event '" + event.event + "' to the actual dom event -- " + ex;
    }

    if (event.inject.event.source) {
      eventSourceDomElement = app.dependencies.domEvents.getEventSourceDomElement(domArgs);
      eventSourcePath = app.dependencies.domMapping.reverseEngineerPathToElement(eventSourceDomElement);
    }
  }

  var keyboardEvent;
  if (domArgs.length === 1 && (domArgs[0].type === 'keydown' || domArgs[0].type === 'keyup')) {
    keyboardEvent = domArgs[0];
  }

  

  if (event.condition) {
    var args = applicationArgsCreator(domVariables, eventSourcePath, eventSourceDomElement, keyboardEvent);
    var eventConditionMet = event.condition.apply(args);
    if (eventConditionMet !== true) {
      console.log("Event condition was not met");
      return;
    }
  }

  var scenariosToExecute = [];

  Object.keys(possibleScenarios).forEach(function(possibleScenarioName) {
    var possibleScenario = possibleScenarios[possibleScenarioName];
    var args = applicationArgsCreator(domVariables, eventSourcePath, eventSourceDomElement, keyboardEvent);

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

  var scenarioDomState = {};


  //we iterate through the scenarios randomly so that no one depends on scenario execution order.
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  var indicesLeft = [];
  for (var i=0; i<scenariosToExecute.length; i++) {
    indicesLeft.push(i);
  }

  var atLeastOneScenarioSucceeded = false;

  while (indicesLeft.length > 0) {
    var randomIndexOfIndex = getRandomInt(0, indicesLeft.length);
    var randomIndex = indicesLeft[randomIndexOfIndex];
    indicesLeft.splice(randomIndexOfIndex, 1);

    var scenario = scenariosToExecute[randomIndex];
    try {
      var args = applicationArgsCreator(domVariables, eventSourcePath, eventSourceDomElement);
      scenario.outcome.call(args);
      scenarioDomState[ScenarioPrototype.getFullyQualifiedName(scenario)] = args.dom;
      atLeastOneScenarioSucceeded = true;
    } catch (ex) {
      console.log('Scenario "' + ScenarioPrototype.getFullyQualifiedName(scenario) + '" failed with error -- ' + ex.stack);
    }
  }

  if (atLeastOneScenarioSucceeded) {
    var newDomState = app.dependencies.domPatching.calculateDesiredDomState(domVariables.dom, scenarioDomState);
    app.dependencies.domPatching.patchDom(event.location, domVariables.dom, newDomState);
  }
};