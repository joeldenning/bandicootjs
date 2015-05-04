module.exports = function(options) {
  var app = require('./index.js');
  var args = app.dependencies.cloneDeep(options.domVariables);
  args.event = {};
  if (options.eventSourceDomElement) {
    try {
      args.event.source = app.dependencies.domMapping.getJSElFromPath(options.domVariables.dom, options.eventSourcePath);
    } catch(ex) {
      args.event.source = app.dependencies.domMapping.domElToJsEl(options.eventSourceDomElement);
    }
  }

  if (options.keyboardEvent) {
    args.event.keyboard = {
      altKey: options.keyboardEvent.altKey,
      ctrlKey: options.keyboardEvent.ctrlKey,
      keyCode: options.keyboardEvent.keyCode,
      keyIdentifier: options.keyboardEvent.keyIdentifier,
      shiftKey: options.keyboardEvent.shiftKey
    };
  }

  if (options.services && options.owner) {
    args.services = {};
    for (var i=0; i<options.services.length; i++) {
      var fullyQualifiedServiceName = options.owner + '/' + options.services[i];
      var service = app.dependencies.slashNamespacing.getValueFromNamespacedObject(app.Services, fullyQualifiedServiceName);
      if (service) {
        args.services[options.services[i]] = service;
      } else {
        throw "Could not find service '" + options.services[i] + "'";
      }
    }
  }

  return args;
}