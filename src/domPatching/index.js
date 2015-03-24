var deepDiff = require('deep-diff');
var _ = require('lodash');

module.exports.build = function() {
  return {
    calculateDesiredDomState: function(currentDomState, domPatches) {
      var domState = _.cloneDeep(currentDomState, require('../domMapping/cloneDeep-customizer.js'));

      var pathsBeingPatched = {};
      var pathCollision = undefined;

      for (var domPatchName in domPatches) {
        var domPatch = domPatches[domPatchName];
        deepDiff.applyDiff(domState, domPatch, function(target, source, diffArray) {
          var path = diffArray.path.join('/')
          if (pathsBeingPatched[path]) {
            throw "Cannot compute dom diff -- '" + path + "' was changed by both '" + pathsBeingPatched[path] + "' and '" + domPatchName + "'";
          }
          pathsBeingPatched[path] = domPatchName;
          return true;
        });
      }

      return domState;
    },
    patchDom: require('./patch.js')
  }
}