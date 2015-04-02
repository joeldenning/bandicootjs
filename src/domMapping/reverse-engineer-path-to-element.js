module.exports = function(element, array) {
  var dataLocation = element.getAttribute('data-location');
  if (dataLocation) {
    array.unshift(dataLocation);
    //once we hit the location element, we have traversed everything
    return;
  }
  var dataName = element.getAttribute('data-name');
  if (dataName) {
    array.unshift(dataName);
    reverseEngineerPathToElement(element.parentNode, array);
  } else {
    throw "Element '" + element.tagName + "' does not have a data-name attribute";
  }
}