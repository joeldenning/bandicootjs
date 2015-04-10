module.exports = function(currentDomState, domPatches) {
  var domPatching = require('./index.js');

  var domState = domPatching.dependencies.cloneDeep(currentDomState);

  for (var domPatchName in domPatches) {
    var domPatch = domPatches[domPatchName];
    var diffs = domPatching.dependencies.deepDiff.diff(domState, domPatch);
    if (diffs) {
      /* apply the diffs to the domState in reverse order, since applying in 
      we want to remove elements from the end of arrays before the beginning of arrays */
      for (var i=diffs.length - 1; i>=0; i--) {
        domPatching.dependencies.deepDiff.applyChange(domState, true, diffs[i]);
      }
    }
  }

  return domState;
}