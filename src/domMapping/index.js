module.exports.build = function() {
  return {
    extractToVariables: require('./dom-extraction.js'),
    verifyTypes: require('./type-verification.js'),
    domElToJsEl: require('./domEl-to-jsEl.js'),
    reverseEngineerPathToElement: require('./reverse-engineer-path-to-element.js'),
    getJSElFromPath: require('./getJSElFromPath.js'),
    transferAttrFromDomElToObj: require('./transferAttrFromDomElToObj.js')
  };
};