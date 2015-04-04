var _ = require ('lodash');

module.exports = function(element, attrName, targetObject) {
  if (!targetObject) {
    //just to avoid reference errors
    targetObject = {};
  }
  var value;
  switch(attrName) {
    case 'class':
      //we don't use classList because it is a weird object that doesn't have .indexOf
      value = targetObject.class = element.className.split(/ +/);
    break;
    case 'value':
      value = targetObject.value = element.value;
    break;
    default:
      value = targetObject[_.camelCase(attrName)] = element.getAttribute(attrName);
    break;
  }
  return value;
}