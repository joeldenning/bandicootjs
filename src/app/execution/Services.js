module.exports = function(input) {
  var app = require('../index.js');
  var ServicePrototype = require('../prototype/Service.js');

  if (typeof input === 'string') {
    if (!app.Services[input]) {
      throw "No such service '" + input + "'";
    }
    return app.Services[input];
  } else {
    app.dependencies.strictTyping.validateObjectIsOfType(input, 'Service');
    var service = input;
    var fullyQualifiedName = ServicePrototype.getFullyQualifiedName(event);
    if (typeof ServicePrototype[fullyQualifiedName] !== 'undefined') {
      throw 'Service with name "' + fullyQualifiedName + "' already exists";
    }
    app.dependencies.slashNamespacing.addPropertyToObjectFromSlashNamespacedName(app.Services, fullyQualifiedName, event);
    return services;
  }
}