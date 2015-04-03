module.exports.build = function(domMapping) {
  return {
    getEventSourceDomElement: function(domArgs) {
      return domArgs[0].currentTarget;
    }
  };
};