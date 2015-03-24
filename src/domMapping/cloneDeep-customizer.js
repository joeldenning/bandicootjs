var _ = require('lodash');

var customizer = function(value, key, object) {
  if (_.isArray(value)) {
    var clone = [];
    for (var property in value) {
      clone[property] = _.cloneDeep(value[property], customizer);
    }
    return clone;
  } else {
    //let cloneDeep do its normal thing
    return undefined;
  }
};

module.exports = customizer;