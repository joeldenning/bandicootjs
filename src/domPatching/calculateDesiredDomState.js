module.exports = function(currentDomState, domPatches) {
  var domPatching = require('./index.js');

  var domState = domPatching.dependencies.cloneDeep(currentDomState);

  for (var domPatchName in domPatches) {
    var domPatch = domPatches[domPatchName];
    var diffs = domPatching.dependencies.deepDiff.diff(domState, domPatch);
    for (var i=diffs.length - 1; i>=0; i--) {
      domPatching.dependencies.deepDiff.applyChange(domState, true, diffs[i]);
    }
  }

  return domState;
}