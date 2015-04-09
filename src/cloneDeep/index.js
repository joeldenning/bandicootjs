module.exports.build = function() {
  var _ = module.exports.dependencies.lodash;

  var customizer = function(value, key, object) {
    if (_.isArray(value)) {
      var clone = [];
      for (var property in value) {
        clone[property] = _.cloneDeep(value[property], customizer);
      }
      return clone;
    } else if (_.isFunction(value)) {
      //having the clone reference the same function as the original is not really a deep clone, but I don't see any harm in it.
      return value;
    } else {
      //let cloneDeep do its normal thing
      return undefined;
    }
  };

	return function(obj) {
    var target = obj ? obj : this;
    return _.cloneDeep(target, customizer);
  };
};