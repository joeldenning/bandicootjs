var _ = require('lodash');
var deepDiff = require('deep-diff');

function setJsAttrAsDomAttr(key, value, domEl) {
  if (key === 'tagName') {
    //already encapsulated by the element type
    return;
  } else if (_.isNumber(value) || _.isString(value) || _.isBoolean(value)) {
    if (key.toLowerCase() === 'innerhtml') {
      domEl.innerHTML = value;
    } else if (key === 'dataType') {
      domEl.setAttribute('data-type', value);
    } else if (key === 'dataName') {
      domEl.setAttribute('data-name', value);
    } else if (key === 'value') {
      domEl.value = value;
    } else {
      domEl.setAttribute(key, value);
    }
  } else if (_.isFunction(value)) {
    return;
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
  for (var i=0; i<diffs.length; i++) {
    var diff = diffs[i];

    var domElement = document.body.querySelector('[data-location="' + location + '"]');
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
        domElement = domElement.querySelector('[data-name="' + partOfPath + '"]');
        if (_.isUndefined(domElement)) {
          throw "Could not find '" + diff.partOfPath + "'";
        }
      }
    }
    switch (diff.kind) {
      case 'A': //array
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

      break;
    }
  }
}