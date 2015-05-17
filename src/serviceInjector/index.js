module.exports.build = function() {
  var deps = module.exports.dependencies;

  var injectedTypes = {};

  return {
    registerInjectedType: function(injectedType) {
      deps.strictTyping.validateObjectIsOfType(injectedType, 'ServiceInjectedType');
      if (injectedTypes[injectedType.name]) {
        throw "Service injectedType of name '" + injectedType.name + "' already exists";
      } else {
        injectedTypes[injectedType.name] = injectedType;
      }
    },
    getPropertiesToInject: function(service) {
      if (!service.inject) {
        return undefined;
      }

      var result = {};

      for (var property in service.inject) {
        var type = service.inject[property];
        var options = {
          service: deps.cloneDeep(service)
        };
        if (injectedTypes[type]) {
          result[property] = injectedTypes[type].construct(service);
        } else {
          throw "No such injected type '" + type + "' to inject into service '" + service.owner + "/" + service.service;
        }
      }

      return result;
    }
  };
};