module.exports = function(currentDomState, domPatches) {
  var domPatching = require('./index.js');

  var domState = domPatching.dependencies.cloneDeep(currentDomState);

  var pathsBeingPatched = {};
  var pathCollision = undefined;

  for (var domPatchName in domPatches) {
    var domPatch = domPatches[domPatchName];
    domPatching.dependencies.deepDiff.applyDiff(domState, domPatch, function(target, source, diffArray) {
      var path = diffArray.path.join('/')
      if (pathsBeingPatched[path]) {
        throw "Cannot compute dom diff -- '" + path + "' was changed by both '" + pathsBeingPatched[path] + "' and '" + domPatchName + "'";
      }
      pathsBeingPatched[path] = domPatchName;
      return true;
    });
  }

  return domState;
}