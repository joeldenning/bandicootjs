module.exports.build = function() {
  var deps = module.exports.dependencies;

  return {
    getPropertiesToInject: function(service) {
      if (!service.inject) {
        return undefined;
      }

      var result = {};

      for (var property in service.inject) {
        var type = service.inject[property];
        switch (type) {
          case 'loki':
            result[property] = new deps.loki();
          break;
          default:
            throw "Cannot inject property '" + property + "' into service -- unknown type '" + type + "'";
        }
      }

      return result;
    }
  };
};