var app = require('../index.js');

module.exports.initializeService = function(service) {
  if (service._isInitialized) {
    return;
  }
  var injectedProps = app.dependencies.serviceInjector.getPropertiesToInject(service);

  for (var property in service) {
    if (typeof service[property] === 'function') {
      service[property] = service[property].bind(injectedProps);
    }
  }
  
  if (service.initialize) {
    try {
      service.initialize();
    } catch (ex) {
      throw "Error constructing service '" + fullyQualifiedName + "': " + ex;
    }
  }
}

module.exports = function(input) {
  var ServicePrototype = require('../prototype/Service.js');

  if (typeof input === 'string') {
    if (!app.Services[input]) {
      throw "No such service '" + input + "'";
    }
    return app.Services[input];
  } else {
    app.dependencies.strictTyping.validateObjectIsOfType(input, 'Service');
    var service = input;
    var fullyQualifiedName = ServicePrototype.getFullyQualifiedName(service);
    if (typeof ServicePrototype[fullyQualifiedName] !== 'undefined') {
      throw 'Service with name "' + fullyQualifiedName + "' already exists";
    }

    app.dependencies.slashNamespacing.addPropertyToObjectFromSlashNamespacedName(app.Services, fullyQualifiedName, service);
    return service;
  }
}