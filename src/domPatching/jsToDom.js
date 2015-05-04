var _ = require('./index.js').dependencies.lodash;

var jsElToDomEl = module.exports.jsElToDomEl = function(jsDomEl) {
  var newDomElement = document.createElement(jsDomEl.tagName);

  if (_.isArray(jsDomEl)) {
    newDomElement.setAttribute('data-type', jsDomEl['data-type']);
    newDomElement.setAttribute('data-name', jsDomEl['data-name']);
    for (var property in jsDomEl) {
      var index = _.parseInt(property);
      if (!isNaN(index)) {
        newDomElement.appendChild(jsElToDomEl(jsDomEl[property]))
      }
    }
  } else if (_.isPlainObject(jsDomEl)) {
    for (var attr in jsDomEl) {
      var attrValue = jsDomEl[attr];
      if (attrValue.tagName) {
        //domEl
        if (attr === 'tagName') {
          continue;
        } else if (attr.indexOf('data-') === 0) {
          setJsAttrAsDomAttr('data' + attr.substr(5, attr.length - 5), attrValue, newDomElement);
        } else {
          setJsAttrAsDomAttr(attr, attrValue, newDomElement);
        }
      } else if (attr === 'style') {
        if (!_.isPlainObject(attrValue)) {
          throw "The style property must be a plain javascript object";
        }
        var styleAsString = '';
        var prefix = '';
        for (var cssAttr in attrValue) {
          var cssValue = attrValue[cssAttr];
          styleAsString += prefix + cssAttr + ": " + cssValue;
          prefix = '; ';
        }
        setJsAttrAsDomAttr('style', styleAsString, newDomElement);
      } else {
        setJsAttrAsDomAttr(attr, attrValue, newDomElement);
      }
    }
  } else {
    setJsAttrAsDomAttr(attr, attrValue, newDomElement);
  }
  
  return newDomElement;
};

var setJsAttrAsDomAttr = module.exports.setJsAttrAsDomAttr = function(key, value, domEl) {
  if (key === 'tagName') {
    //already encapsulated by the element type
    return;
  } else if (_.isNumber(value) || _.isString(value) || _.isBoolean(value)) {
    if (key === 'dataType' || key === 'data-type') {
      domEl.setAttribute('data-type', value);
    } else if (key === 'dataName' || key === 'data-name') {
      domEl.setAttribute('data-name', value);
    } else if (key === 'type') {
      domEl.type = value;
    } else if (key === 'name') {
      domEl.name = value;
    } else if (key === 'value') {
      domEl.value = value;
    } else if (key === 'checked') {
      if (value) {
        domEl.checked = true;
      } else {
        domEl.checked = false;
      }
      domEl.removeAttribute('checked');
    } else if (key === 'text') {
      for (var i=0; i<domEl.childNodes.length; i++) {
        if (domEl.childNodes[i].nodeType === 3) {
          domEl.childNodes[i].remove();  
        }
      }
      var textNode = document.createTextNode(value);
      domEl.insertBefore(textNode, domEl.firstChild);
    } else {
      domEl.setAttribute(key, value);
    }
  } else if (_.isFunction(value)) {
    return;
  } else if (_.isArray(value)) {
    if (key === 'class') {
      domEl.className = value.join(" ");
    } else {
      throw "No support for patching dom attribute (of type array) called '" + key + "'";
    }
  } else {
    var newEl = jsElToDomEl(value);
    newEl.setAttribute('data-name', key);
    domEl.appendChild(newEl);
  }
}