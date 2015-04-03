
module.exports.build = function(strictTyping, domElements, cloneDeep) {
  module.exports.dependencies = {
    'strictTyping': strictTyping,
    'domElements': domElements,
    'cloneDeep': cloneDeep
  };

  return {
    extractToVariables: function(location) {
      return require('./dom-extraction.js')(location, cloneDeep);
    },
    verifyTypes: require('./type-verification.js'),
    domElToJsEl: require('./domEl-to-jsEl.js'),
    reverseEngineerPathToElement: require('./reverse-engineer-path-to-element.js'),
    getJSElFromPath: require('./getJSElFromPath.js')
  };
};