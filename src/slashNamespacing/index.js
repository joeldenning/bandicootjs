module.exports.build = function() {
  return {
    addPropertyToObjectFromSlashNamespacedName: function(object, slashNamespacedName, propertyValue) {
      var remainingName = slashNamespacedName;
      var objectWorkingOn = object;
      while(remainingName.length > 0) {
        var nextSlashIndex = remainingName.indexOf('/');
        var nextNamespace;
        if (nextSlashIndex < 0) {
          objectWorkingOn[remainingName] = propertyValue;
          remainingName = '';
        } else {
          nextNamespace = remainingName.substr(0, nextSlashIndex);
          if (!objectWorkingOn[nextNamespace]) {
            objectWorkingOn[nextNamespace] = {};
          }
          objectWorkingOn = objectWorkingOn[nextNamespace];
          remainingName = remainingName.substr(nextSlashIndex+1);
        }
      }
    },
    getValueFromNamespacedObject: function(object, slashNamespacedName) {
      if (!object || !slashNamespacedName) {
        return undefined;
      }
      var remainingName = slashNamespacedName;
      var objectWorkingOn = object;
      while(true) {
        var nextSlashIndex = remainingName.indexOf('/');
        var nextNamespace;
        if (nextSlashIndex < 0) {
          return objectWorkingOn[remainingName];
        } else {
          nextNamespace = remainingName.substr(0, nextSlashIndex);
          if (!objectWorkingOn[nextNamespace]) {
            return undefined;
          }
          objectWorkingOn = objectWorkingOn[nextNamespace];
          remainingName = remainingName.substr(nextSlashIndex+1);
        }
      }
    }
  };
};