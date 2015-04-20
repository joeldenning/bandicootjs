var _ = require('./index.js').dependencies.lodash;

function traverseElement(element, bandicootElements, bandicootLists,
    bandicootListToAddTo, bandicootListItemToAddTo, bandicootObjectToAddTo, buildingBlocks) {

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
          bandicootListToAddTo.cloneDeep = require('./index.js').dependencies.cloneDeep.bind(bandicootListToAddTo);
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
          newObject.cloneDeep = require('./index.js').dependencies.cloneDeep.bind(newObject);

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
    var childNode = element.childNodes[i];
    if (childNode.tagName && childNode.tagName.toUpperCase() === 'SCRIPT') {
      var dataName = element.getAttribute('data-name');
      if (buildingBlocks[dataName]) {
        throw "Two building blocks have the same name '" + dataName + "'";
      }

      var lists = {};
      var elements = {};
      var objects = {};
      var listToAddTo = listItemToAddTo = undefined;

      var domParser = new DOMParser();
      var parsedDom = domParser.parseFromString(childNode.text, "text/html");
      traverseElement(parsedDom, elements, lists, listToAddTo, listItemToAddTo,
        objects, buildingBlocks);

      buildingBlocks[dataName] = {
        lists: lists,
        elements: elements,
        objects: objects
      };

    } else {
      //not a script tag
      traverseElement(childNode, bandicootElements, bandicootLists,
        bandicootListToAddTo, bandicootListItemToAddTo, bandicootObjectToAddTo, buildingBlocks);   
    }
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
  if (matchingLocations.length < 1) {
    throw "Could not find location '" + location + "' in the DOM";
  } else if (matchingLocations.length > 1) {
    throw "Clashing locations: there are two locations named '" + location + "'";
  }

  var domLocation = matchingLocations[0];

  var result = {
    dom: {},
    buildingBlocks: {}
  };

  var bandicootLists = {};
  var bandicootElements = {};
  var bandicootObjects = {};
  var bandicootListToAddTo = bandicootListItemToAddTo = undefined;
  var buildingBlocks = {};

  traverseElement(domLocation, bandicootElements, bandicootLists, bandicootListToAddTo, bandicootListItemToAddTo, 
    bandicootObjects, buildingBlocks);

  mergeListsElementsAndObjects(result.dom, bandicootLists, bandicootElements, bandicootObjects);

  for (var buildingBlockName in buildingBlocks) {
    var buildingBlock = buildingBlocks[buildingBlockName];
    mergeListsElementsAndObjects(result.buildingBlocks, buildingBlock.lists, 
        buildingBlock.elements, buildingBlock.objects);
  }

  return result;
};