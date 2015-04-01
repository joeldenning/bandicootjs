var _ = require('lodash');

function traverseElement(element, bandicootElements, bandicootLists, bandicootObjects,
    bandicootListToAddTo, bandicootListItemToAddTo, bandicootObjectToAddTo, elementDefinitions,
    cloneDeepCustomizer) {

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
            dataType: dataType,
            dataName: dataName,
            cloneDeep: function() {
              return _.cloneDeep(jsEl, cloneDeepCustomizer);
            }
          };
          for (var i=0; i<element.attributes.length; i++) {
            jsEl[element.attributes[i].nodeName] = element.attributes[i].value;
          }
          if (element.value) {
            jsEl.value = element.value;
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
            return _.cloneDeep(bandicootListToAddTo, cloneDeepCustomizer);
          };
          bandicootListToAddTo.push = function(listItem) {
            if (listItem && listItem.dataType === 'object') {
              listItem.dataType = 'list-item';
            }
            for (var i=0; i<arguments.length; i++) {
              Array.prototype.push.call(this, arguments[i]);          
            }
          }
          bandicootListToAddTo.tagName = element.tagName;
          bandicootListToAddTo.dataType = dataType;
          bandicootListToAddTo.dataName = dataName;

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

          bandicootListItemToAddTo = {
            tagName: element.tagName,
            dataType: dataType,
            dataName: dataName,
            cloneDeep: function() {
              return _.cloneDeep(bandicootListItemToAddTo, cloneDeepCustomizer);
            }
          };

          bandicootListToAddTo.push(bandicootListItemToAddTo);
        break;

        case 'object':
          if (!dataName) {
            throw 'list must have a data-name';
          }

          bandicootObjectToAddTo = {
            tagName: element.tagName,
            dataType: dataType,
            dataName: dataName,
            cloneDeep: function() {
              return _.cloneDeep(bandicootObjectToAddTo, cloneDeepCustomizer);
            }
          };

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

module.exports = function(elementDefinitions, location) {
  var matchingLocations = document.querySelectorAll('[data-location="' + location + '"]');
  var domLocation;
  var buildingBlockLocations = [];
  for (var i=0; i<matchingLocations.length; i++) {
    if (matchingLocations[i].tagName.toUpperCase() === 'SCRIPT') {
      if (matchingLocations[i].getAttribute('type') === 'html/building-blocks') {
        buildingBlockLocations.push(matchingLocations[i]);
      } else {
        //ignore locations declared in script tags that are not html/building-blocks
      }
    } else {
      if (domLocation) {
        throw "Only one '" + domLocation + "' location can be present in the DOM at a time, except for building block locations declared in script tags";
      } else {
        domLocation = matchingLocations[i];
      }
    }
  }

  var result = {
    dom: {},
    buildingBlocks: {}
  };

  if (domLocation) {
    var bandicootLists = {};
    var bandicootElements = {};
    var bandicootObjects = {};
    var bandicootListToAddTo = bandicootListItemToAddTo = bandicootObjectToAddTo = undefined;

    traverseElement(domLocation, bandicootElements, bandicootLists, bandicootObjects, bandicootListToAddTo, bandicootListItemToAddTo, 
      bandicootObjectToAddTo, elementDefinitions);

    mergeListsElementsAndObjects(result.dom, bandicootLists, bandicootElements, bandicootObjects);
  }

  if (buildingBlockLocations.length > 0) {
    var bandicootLists = {};
    var bandicootElements = {};
    var bandicootListToAddTo = bandicootListItemToAddTo = bandicootObjectToAddTo = undefined;

    var domParser = new DOMParser();
    for (var i=0; i<buildingBlockLocations.length; i++) {
      var parsedDom = domParser.parseFromString(buildingBlockLocations[i].text, "text/html");
      traverseElement(parsedDom, bandicootElements, bandicootLists, bandicootObjects, bandicootListToAddTo, bandicootListItemToAddTo,
        bandicootObjectToAddTo, elementDefinitions);
    }

    mergeListsElementsAndObjects(result.buildingBlocks, bandicootLists, bandicootElements, bandicootObjects);
  }

  return result;
};