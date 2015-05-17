var _ = require ('lodash');

module.exports = function(element, attrName, targetObject) {
  targetObject || (targetObject = {});
  var value;
  switch(attrName) {
    case 'class':
      //we don't use classList because it is a weird object that doesn't have .indexOf
      value = targetObject.class = element.className.split(/ +/);
    break;
    case 'value':
      value = targetObject.value = element.value;
    break;
    case 'checked':
      value = targetObject.checked = element.checked;
    break;
    case 'style':
      var unparsedStyles = element.style.cssText.split(";");
      var parsedStyles = {};
      for (var i=0; i<unparsedStyles.length; i++) {
        if (unparsedStyles[i] === '') {
          continue;
        }
        var unparsedStyle = unparsedStyles[i].split(":");
        parsedStyles[unparsedStyle[0].trim()] = unparsedStyle[1].trim();
      }
      value = targetObject.style = parsedStyles;
    break;
    case 'text':
      var text = require('./parseTextAttribute.js')(element);
      if (text.trim().length > 0) {
        value = targetObject.text = text;
      } else {
        value = undefined;
      }
    break;
    default:
      value = targetObject[_.camelCase(attrName)] = element.getAttribute(attrName);
    break;
  }
  return value;
}