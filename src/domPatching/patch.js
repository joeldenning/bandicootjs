var _ = require('lodash');
var deepDiff = require('deep-diff');

var attributesThatAreNotAttributes = ['class', 'type', 'name', 'value', 'onclick', 'innerhtml']

function setJsAttrAsDomAttr(key, value, domEl) {
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
    } else if (key === 'innerHTML') {
      domEl.innerHTML = value;
    } else {
      domEl.setAttribute(key, value);
    }
  } else if (_.isFunction(value)) {
    return;
  } else if (_.isArray(value)) {
    if (key === 'class') {
      domEl.class = value.join(" ");
    } else {
      throw "No support for patching dom attribute (of type array) called '" + key + "'";
    }
  } else {
    var newEl = jsElToDomEl(value);
    newEl.setAttribute('data-name', key);
    domEl.appendChild(newEl);
  }
}

function jsElToDomEl(jsDomEl) {
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
      } else {
        setJsAttrAsDomAttr(attr, attrValue, newDomElement);
      }
    }
  } else {
    setJsAttrAsDomAttr(attr, attrValue, newDomElement);
  }
  
  return newDomElement;
}

module.exports = function(location, currentDomState, desiredDomState) {
  var diffs = deepDiff.diff(currentDomState, desiredDomState, function(key, path) {
    return key === 'cloneDeep';
  });
  if (!diffs) {
    //nothing to do
    return;
  }
  for (var i=0; i<diffs.length; i++) {
    var diff = diffs[i];

    var domElement = document.body.querySelector('[data-location="' + location + '"]');
    var elementAttribute;
    var jsDomEl = desiredDomState;
    for (var j=0; j<diff.path.length; j++) {
      var partOfPath = diff.path[j];
      jsDomEl = jsDomEl[partOfPath];
      var searchIndex = _.parseInt(partOfPath);
      if (!isNaN(searchIndex)) {
        //get the list item corresponding to this number
        var childFound = false;
        var listItemIndex = 0;
        for (var k=0; k<domElement.children.length; k++) {
          var child = domElement.children[k];
          if (child.getAttribute('data-type') === 'list-item' && listItemIndex++ === searchIndex) {
            domElement = child;
            childFound = true;
            break;
          }
        }
        if (!childFound) {
          throw "could not find child";
        }
      } else {
        var newEl = domElement.querySelector('[data-name="' + partOfPath + '"]');
        if (!newEl) {
          if (j == diff.path.length - 1) {
            elementAttribute = domElement.getAttribute(partOfPath) || domElement[partOfPath];
            if (!_.isString(elementAttribute)) {
              throw "Could not find '" + partOfPath + "'";              
            }
          } else {
            throw "Could not find '" + partOfPath + "'";
          }
        } else {
          domElement = newEl;
        }
      }
    }
    switch (diff.kind) {
      case 'A': //array
        if (_.isString(elementAttribute)) {
          switch(diff.item.kind) {
            case 'D': //a deleted item in the current dom is a new item in the desired dom
              setJsAttrAsDomAttr(diff.path[diff.path.length - 1], diff.item.lhs, domElement);              
            break;
          }
        } else if (domElement) {
          var domListItems = domElement.querySelectorAll('[data-type="list-item"]');
          var index = diff.index;
          switch (diff.item.kind) {
            case 'N': //new item
              var newDomElement = jsElToDomEl(jsDomEl[index]);
              if (index === 0) {
                domElement.appendChild(newDomElement);
              } else {
                if (domListItems.length < index - 1) {
                  throw 'dom state does not match expected';
                }
                domElement.insertBefore(newDomElement, domListItems[index]);
              }
            break;
          }
        } else {
          throw "Unknown dom patching failure";
        }
      break;

      default:
        throw "Dom diff of kind '" + diff.kind + "' is not yet supported";
      break;
    }
  }
}