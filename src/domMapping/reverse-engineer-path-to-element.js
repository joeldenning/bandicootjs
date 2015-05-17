function findIndexOfListItem(element) {
  var indexOfChildrenWithDataName = 0;
  for (var i=0; i<element.parentNode.children.length; i++) {
    var child = element.parentNode.children[i];
    if (element === child)
      return indexOfChildrenWithDataName;
    if (child.getAttribute('data-name'))
      indexOfChildrenWithDataName++;
  }
  throw "Could not find index";
}

function reverseEngineerPathToElement(element, pathArray) {
  var dataLocation = element.getAttribute('data-location');
  if (dataLocation) {
    //once we hit the location element, we have traversed everything
    return;
  }
  var dataName = element.getAttribute('data-name');
  if (dataName) {
    var dataType = element.getAttribute('data-type');
    if (dataType === 'list-item' || dataType === 'table-row') {
      pathArray.unshift(findIndexOfListItem(element, dataName));
    } else {
      pathArray.unshift(dataName);
    }
  }

  reverseEngineerPathToElement(element.parentNode, pathArray);
}

module.exports = function(element) {
  var pathArray = [];
  reverseEngineerPathToElement(element, pathArray);
  return pathArray;
}