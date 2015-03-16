var _ = require('lodash');

function traverseElement(element, bandicootElements, bandicootLists, bandicootObjects,
    bandicootListToAddTo, bandicootListItemToAddTo, bandicootObjectToAddTo, elementDefinitions) {

  if (_.isFunction(element.getAttribute)) {
    var dataName = element.getAttribute('data-name');
    var dataType = element.getAttribute('data-type');

    if (dataType) {
      switch(dataType) {
        case 'element':
          if (!dataName) {
            throw 'element must have a data-name';
          }

          var jsEl = {
            cloneDeep: function() {
              return _.cloneDeep(jsEl);
            }
          };
          for (var i=0; i<element.attributes.length; i++) {
            if (element.attributes[i].nodeName.indexOf('data-') !== 0) {
              jsEl[element.attributes[i].nodeName] = element.attributes[i].value;
            }
          }
          jsEl.tagName = element.tagName;
          if (elementDefinitions[element.tagName]) {
            var defn = elementDefinitions[element.tagName];
            jsEl.tagName = defn.tagName;
            for (var attributeName in defn.defaultAttributeValues) {
              if (_.isUndefined(jsEl[attributeName])) {
                var defaultValue = defn.defaultAttributeValues[attributeName];
                switch (typeof defaultValue) {
                  case 'string':
                    jsEl[attributeName] = defaultValue;
                  break;
                  case 'function':
                    jsEl[attributeName] = defaultValue(element);
                  break;
                }
              }
            }
          }

          if (bandicootListItemToAddTo) {
            if (bandicootListItemToAddTo[dataName]) {
              throw "element named '" + dataName + "' already exists in list item";
            }

            bandicootListItemToAddTo[dataName] = jsEl;
          } else if (bandicootObjectToAddTo) {
            if (bandicootObjectToAddTo[dataName]) {
              throw "element named '" + dataName + "' already exists in current object";
            }
            bandicootObjectToAddTo[dataName] = jsEl;
          } else if (bandicootElements[dataName]) {
            throw "element named '" + dataName + "' already exists";
          } else {
            bandicootElements[dataName] = jsEl;
          }
        break;

        case 'list':
          if (!dataName) {
            throw 'list must have a data-name';
          }

          bandicootListToAddTo = [];
          bandicootListToAddTo.cloneDeep = function() {
            return _.cloneDeep(bandicootListToAddTo);
          };

          bandicootListItemToAddTo = undefined;

          if (bandicootLists[dataName]) {
            throw "list named '" + dataName + "' already exists";
          }

          bandicootLists[dataName] = bandicootListToAddTo;
        break;

        case 'list-item':
          if (!dataName) {
            throw 'list must have a data-name';
          }
          if (_.isUndefined(bandicootListToAddTo)) {
            throw "Cannot add list-item '" + dataName + "' because there is no list to add to";
          }

          if (bandicootListItemToAddTo) {
            throw "Cannot add a list item to a list item";
          }

          bandicootListItemToAddTo = {};
          bandicootListItemToAddTo.cloneDeep = function() {
            return _.cloneDeep(bandicootListItemToAddTo);
          }

          bandicootListToAddTo.push(bandicootListItemToAddTo);
        break;

        case 'object':
          if (!dataName) {
            throw 'list must have a data-name';
          }

          bandicootObjectToAddTo = {};
          bandicootObjectToAddTo.cloneDeep = function() {
            return _.cloneDeep(bandicootObjectToAddTo);
          }

          if (bandicootObjects[dataName]) {
            throw "Object named '" + dataName + "' already exists";
          }

          bandicootObjects[dataName] = bandicootObjectToAddTo;
        break;

        default:
          throw "Unknown data-type '" + dataType + "'";
      }
    }
  }

  for (var i=0; i<element.childNodes.length; i++) {
    traverseElement(element.childNodes[i], bandicootElements, bandicootLists, bandicootObjects,
      bandicootListToAddTo, bandicootListItemToAddTo, bandicootObjectToAddTo, elementDefinitions);
  }
};

function mergeListsElementsAndObjects(target, lists, elements, objects) {
  for (var listName in lists) {
    target[listName] = lists[listName];
  }
  for (var elementName in elements) {
    if (target[elementName]) {
      throw "Cannot have two properties with the name '" + elementName + "'";
    }
    target[elementName] = elements[elementName];
  }
  for (var objectName in objects) {
    if (target[objectName]) {
      throw "Cannot have two properties with the name '" + objectName + "'";
    }
    target[objectName] = objects[objectName];
  }
}

module.exports = function(elementDefinitions, scope) {
  var matchingScopes = document.querySelectorAll('[data-scope="' + scope + '"]');
  var domScope;
  var buildingBlockScopes = [];
  for (var i=0; i<matchingScopes.length; i++) {
    if (matchingScopes[i].tagName.toUpperCase() === 'SCRIPT') {
      if (matchingScopes[i].getAttribute('type') === 'html/building-blocks') {
        buildingBlockScopes.push(matchingScopes[i]);
      } else {
        //ignore scopes declared in script tags that are not html/building-blocks
      }
    } else {
      if (domScope) {
        throw "Only one '" + scope + "' scope can be present in the DOM at a time, except for building block scopes declared in script tags";
      } else {
        domScope = matchingScopes[i];
      }
    }
  }

  var result = {
    dom: {},
    buildingBlocks: {}
  };

  if (domScope) {
    var bandicootLists = {};
    var bandicootElements = {};
    var bandicootObjects = {};
    var bandicootListToAddTo = bandicootListItemToAddTo = bandicootObjectToAddTo = undefined;

    traverseElement(domScope, bandicootElements, bandicootLists, bandicootObjects, bandicootListToAddTo, bandicootListItemToAddTo, 
      bandicootObjectToAddTo, elementDefinitions);

    mergeListsElementsAndObjects(result.dom, bandicootLists, bandicootElements, bandicootObjects);
  }

  if (buildingBlockScopes.length > 0) {
    var bandicootLists = {};
    var bandicootElements = {};
    var bandicootListToAddTo = bandicootListItemToAddTo = bandicootObjectToAddTo = undefined;

    var domParser = new DOMParser();
    for (var i=0; i<buildingBlockScopes.length; i++) {
      var parsedDom = domParser.parseFromString(buildingBlockScopes[i].text, "text/html");
      traverseElement(parsedDom, bandicootElements, bandicootLists, bandicootObjects, bandicootListToAddTo, bandicootListItemToAddTo,
        bandicootObjectToAddTo, elementDefinitions);
    }

    mergeListsElementsAndObjects(result.buildingBlocks, bandicootLists, bandicootElements, bandicootObjects);
  }

  return result;
};