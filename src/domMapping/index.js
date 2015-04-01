module.exports.build = function(strictTyping, domElements) {

  return {
    extractToVariables: function(location) {
      return require('./dom-extraction.js')(domElements, location);
    },
    verifyTypes: require('./type-verification.js')
  };
};