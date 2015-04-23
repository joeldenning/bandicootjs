function findIndexOfListItem(element) {
  var i;
  for (i=0; i<element.parentNode.children.length; i++) {
    if (element === element.parentNode.children[i]) {
      break;
    }
  }
  return i;
}

function reverseEngineerPathToElement(element, pathArray) {
  var dataLocation = element.getAttribute('data-location');
  if (dataLocation) {
    pathArray.unshift(dataLocation);
    //once we hit the location element, we have traversed everything
    return;
  }
  var dataName = element.getAttribute('data-name');
  if (dataName) {
    var dataType = element.getAttribute('data-type');
    if (dataType === 'list-item') {
      pathArray.unshift(findIndexOfListItem(element));
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