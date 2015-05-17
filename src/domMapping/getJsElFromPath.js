module.exports = function(jsRepresentation, path) {
  var currentEl = jsRepresentation;
  for (var i=0; i<path.length; i++) {
    if (currentEl[path[i]]) {
      currentEl = currentEl[path[i]];
    } else {
      throw "Unable to find property '" + path[i] + "'";
    }
  }
  return currentEl;
}