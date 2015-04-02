module.exports.build = function(domMapping) {
  return {
    findDOMElFromDomArgs: function(domArgs, domVariables, location) {
      var pathToDomEl = [];
      var domElementThatTriggeredEvent = domArgs[0].currentTarget;
      domMapping.reverseEngineerPathToElement(domElementThatTriggeredEvent, pathToDomEl);
      if (pathToDomEl[0] === location) {
        var currentEl = domVariables;
        for (var i=1; i<pathToDomEl.length; i++) {
          if (currentEl[pathToDomEl[i]]) {
            currentEl = currentEl[pathToDomEl[i]];
          } else {
            throw "Unable to find property '" + pathToDomEl[i] + "'";
          }
        }
        return currentEl;
      } else {
        return domMapping.domElToJsEl(domElementThatTriggeredEvent);
      }
    }
  };
};