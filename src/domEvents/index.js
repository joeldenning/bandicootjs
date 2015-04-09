module.exports.build = function() {
  return {
    getEventSourceDomElement: function(domArgs) {
      return domArgs[0].currentTarget;
    }
  };
};