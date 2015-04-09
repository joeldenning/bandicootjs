var _ = require('./index.js').dependencies.lodash;

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
  var domPatching = require('./index.js');

  var diffs = require('./index.js').dependencies.deepDiff.diff(currentDomState, desiredDomState, function(key, path) {
    return key === 'cloneDeep';
  });
  if (!diffs) {
    //nothing to do
    return;
  }

  var domOperationsToPerform = [];
  var elementAttribute, attrName;

  for (var i=0; i<diffs.length; i++) {
    var diff = diffs[i];

    var domElement = document.body.querySelector('[data-location="' + location + '"]');
    var jsDomEl = desiredDomState;
    var continueSearching = true;
    elementAttribute = undefined;
    attrName = undefined;
    for (var j=0; j<diff.path.length && continueSearching; j++) {
      var partOfPath = diff.path[j];
      jsDomEl = jsDomEl[partOfPath];
      if (_.isFunction(jsDomEl)) {
        //we don't patch dom functions
        continue;
      }
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
        if (newEl) {
          domElement = newEl;
        } else {
          elementAttribute = domPatching.dependencies.domMapping.transferAttrFromDomElToObj(domElement, partOfPath);
          if (elementAttribute) {
            continueSearching = false;
            attrName = partOfPath;
          }
        }
      }
    }

    var patchSupported = false;
    var errorMsg = '';
    switch (diff.kind) {
      case 'A': //array
        if (elementAttribute) {
          switch(diff.item.kind) {
            case 'D': //a deleted item in the current dom is a new item in the desired dom
              if (diff.item.lhs) {
                domOperationsToPerform.push({
                  type: 'setJsAttrAsDomAttr',
                  attrName: attrName,
                  attrValue: diff.item.lhs,
                  element: domElement
                });
                patchSupported = true;
              }            
            break;
            case 'N': //a new item in the current dom means that it is deleted in the desired dom
              if (_.isArray(elementAttribute)) {
                var indexToRemove = elementAttribute.indexOf(diff.item.rhs);
                if (indexToRemove >= 0) {
                  elementAttribute.splice(indexToRemove, 1);
                  domOperationsToPerform.push({
                    type: 'setJsAttrAsDomAttr',
                    attrName: attrName,
                    attrValue: elementAttribute,
                    element: domElement
                  })
                  patchSupported = true;            
                } else {
                  errorMsg = 'could not find existing dom attribute ' + elementAttribute;
                }
              } else if (_.isString(elementAttribute)) {
                domOperationsToPerform.push({
                  type: 'setJsAttrAsDomAttr',
                  attrName: attrName,
                  attrValue: elementAttribute.replace(diff.item.rhs, ''),
                  element: domElement
                });
                patchSupported = true;            
              }
            break;
          }
        } else if (domElement) {
          var domListItems = domElement.querySelectorAll('[data-type="list-item"]');
          var index = diff.index;
          switch (diff.item.kind) {
            case 'N': //new item
              var newDomElement = jsElToDomEl(jsDomEl[index]);
              if (index === 0) {
                domOperationsToPerform.push({
                  type: 'appendChild',
                  parent: domElement,
                  child: newDomElement
                })
                patchSupported = true;
              } else {
                if (domListItems.length < index - 1) {
                  errorMsg = 'dom state does not match expected';
                } else {
                  domOperationsToPerform.push({
                    type: 'insertBefore',
                    parent: domElement,
                    child: domListItems[index],
                    newElement: newDomElement
                  });
                  patchSupported = true;            
                }
              }
            break;
            case 'D': //deleted item
              if (diff.item.lhs) {
                domOperationsToPerform.push({
                  type: 'remove',
                  element: domListItems[index]
                });
                patchSupported = true;            
              }
            break;
          }
        }
      break;
      case 'E': //edit
        if (_.isFunction(diff.rhs) || _.isFunction(diff.lhs)) {
          //we don't ever patch any functions, so this patch is supported
          patchSupported = true;
        } else {
          if (elementAttribute) {
            domOperationsToPerform.push({
              type: 'setJsAttrAsDomAttr',
              attrName: attrName,
              attrValue: diff.rhs,
              element: domElement
            });
            patchSupported = true;
          }
        }
      break;
    }

    if (!patchSupported) {
      console.log("domElement = ")
      console.dir(domElement);
      console.log("attrName = " + attrName);
      console.log("element attribute = ")
      console.dir(elementAttribute)
      console.log("diff = ")
      console.dir(diff);
      var diffItemKind = diff.item ? diff.item.kind : null;
      throw "Unsupported dom patch operation -- diff.kind = " + diff.kind 
        + ", diff.item.kind = " + diffItemKind + ", errorMsg = " + errorMsg;
    }
  }

  domOperationsToPerform.forEach(function(domOperationToPerform) {
    switch (domOperationToPerform.type) {
      case 'setJsAttrAsDomAttr':
        setJsAttrAsDomAttr(domOperationToPerform.attrName, domOperationToPerform.attrValue, domOperationToPerform.element);
      break;
      case 'appendChild':
        domOperationToPerform.parent.appendChild(domOperationToPerform.child);
      break;
      case 'remove':
        domOperationToPerform.element.remove();
      break;
      case 'insertBefore':
        domOperationToPerform.parent.insertBefore(domOperationToPerform.newElement, domOperationToPerform.child);
      break;
      default:
        throw "Unsupported dom patch operation of type '" + domOperationToPerform.type + "'";
      break;
    }
  });
}