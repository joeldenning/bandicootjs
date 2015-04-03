var _ = require('lodash');

function traverseElement(element, bandicootElements, bandicootLists,
    bandicootListToAddTo, bandicootListItemToAddTo, bandicootObjectToAddTo) {

  if (_.isFunction(element.getAttribute)) {
    var dataName = element.getAttribute('data-name');
    var dataType = element.getAttribute('data-type');

    if (dataType) {
      switch(dataType) {
        case 'element':
          if (!dataName) {
            throw 'element must have a data-name';
          }

          var jsEl = require('./domEl-to-jsEl.js')(element);
          jsEl.dataType = dataType;
          jsEl.dataName = dataName;

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
            return _.cloneDeep(bandicootListToAddTo, require('./index.js').dependencies.cloneDeep.lodashCustomizer);
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
        case 'object':
          if (!dataName) {
            throw 'list must have a data-name';
          }

          var newObject = require('./domEl-to-jsEl.js')(element);
          newObject.cloneDeep = function() {
            return _.cloneDeep(newObject, require('./index.js').dependencies.cloneDeep.lodashCustomizer);
          };

          if (bandicootListToAddTo) {
            newObject.dataType = 'list-item';
            bandicootListToAddTo.push(newObject);
            bandicootListToAddTo = undefined;
          } else {
            if (bandicootObjectToAddTo[dataName]) {
              throw "Object named '" + dataName + "' already exists";
            }

            newObject.dataType = 'object';
            bandicootObjectToAddTo[dataName] = newObject;
          }

          bandicootObjectToAddTo = newObject; 
        break;

        default:
          throw "Unknown data-type '" + dataType + "' in element '" + element.tagName + "'";
      }
    }
  }

  for (var i=0; i<element.childNodes.length; i++) {
    traverseElement(element.childNodes[i], bandicootElements, bandicootLists,
      bandicootListToAddTo, bandicootListItemToAddTo, bandicootObjectToAddTo);
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

module.exports = function(location) {
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
    var bandicootListToAddTo = bandicootListItemToAddTo = undefined;

    traverseElement(domLocation, bandicootElements, bandicootLists, bandicootListToAddTo, bandicootListItemToAddTo, 
      bandicootObjects);

    mergeListsElementsAndObjects(result.dom, bandicootLists, bandicootElements, bandicootObjects);
  }

  if (buildingBlockLocations.length > 0) {
    var bandicootLists = {};
    var bandicootElements = {};
    var bandicootObjects = {};
    var bandicootListToAddTo = bandicootListItemToAddTo = undefined;

    var domParser = new DOMParser();
    for (var i=0; i<buildingBlockLocations.length; i++) {
      var parsedDom = domParser.parseFromString(buildingBlockLocations[i].text, "text/html");
      traverseElement(parsedDom, bandicootElements, bandicootLists, bandicootListToAddTo, bandicootListItemToAddTo,
        bandicootObjects);
    }

    mergeListsElementsAndObjects(result.buildingBlocks, bandicootLists, bandicootElements, bandicootObjects);
  }

  return result;
};