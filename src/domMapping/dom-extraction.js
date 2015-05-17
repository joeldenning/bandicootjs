var domMapping = require('./index.js');
var _ = domMapping.dependencies.lodash;

function logAndThrowException(element, exception) {
  console.log('Element that caused exception:');
  console.log(element);
  throw exception;
}

function traverseElement(element, bandicootElements, bandicootLists,
    bandicootListToAddTo, bandicootListItemToAddTo, bandicootObjectToAddTo, 
    bandicootTableToAddTo, buildingBlocks) {

  if (_.isFunction(element.getAttribute)) {
    var dataName = element.getAttribute('data-name');
    var dataType = element.getAttribute('data-type');

    if (dataType) {
      switch(dataType) {
        case 'element':
          if (!dataName) {
            logAndThrowException(element, 'element must have a data-name');
          }

          var jsEl = require('./domEl-to-jsEl.js')(element);
          jsEl.dataType = dataType;
          jsEl.dataName = dataName;

          if (bandicootListItemToAddTo) {
            bandicootListItemToAddTo[dataName] = jsEl;
          } else if (bandicootObjectToAddTo) {
            if (bandicootObjectToAddTo[dataName]) {
              logAndThrowException(element, "element named '" + dataName + "' already exists in current object");
            }
            bandicootObjectToAddTo[dataName] = jsEl;
          } else if (bandicootElements[dataName]) {
            logAndThrowException(element, "element named '" + dataName + "' already exists");
          } else {
            bandicootElements[dataName] = jsEl;
          }
        break;

        case 'list':
          if (!dataName) {
            logAndThrowException(element, 'list must have a data-name');
          }

          bandicootListToAddTo = [];
          bandicootListToAddTo.cloneDeep = domMapping.dependencies.cloneDeep.bind(bandicootListToAddTo);
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
            logAndThrowException(element, "list named '" + dataName + "' already exists");
          }

          bandicootLists[dataName] = bandicootListToAddTo;
        break;

        case 'list-item':
        case 'object':
          if (!dataName) {
            throw 'list must have a data-name';
          }

          var newObject = require('./domEl-to-jsEl.js')(element);
          newObject.cloneDeep = domMapping.dependencies.cloneDeep.bind(newObject);
          newObject.tagName = element.tagName;

          if (bandicootListToAddTo) {
            newObject.dataType = 'list-item';
            bandicootListToAddTo.push(newObject);
            bandicootListToAddTo = undefined;
          } else {
            if (bandicootObjectToAddTo[dataName]) {
              logAndThrowException(element, "Object named '" + dataName + "' already exists");
            }

            newObject.dataType = 'object';
            bandicootObjectToAddTo[dataName] = newObject;
          }

          bandicootObjectToAddTo = newObject; 
        break;

        case 'table':
          if (!dataName) {
            logAndThrowException(element, 'tables must have a data-name');
          }
          var newObject = require('./domEl-to-jsEl.js')(element);
          newObject.cloneDeep = domMapping.dependencies.cloneDeep.bind(newObject);
          newObject.dataType = 'table';
          newObject.tagName = element.tagName;
          var newTable = [];
          _.assign(newTable, newObject);

          if (bandicootObjectToAddTo[dataName]) {
            logAndThrowException(element, "Object named '" + dataName + "' already exists");
          }

          bandicootObjectToAddTo[dataName] = newTable;

          if (bandicootTableToAddTo) {
            logAndThrowException(element, "Tables within tables are not yet supported.");
          }

          bandicootTableToAddTo = newTable;
        break;

        case 'table-row':
          var newObject = require('./domEl-to-jsEl.js')(element);
          newObject.cloneDeep = domMapping.dependencies.cloneDeep.bind(newObject);
          newObject.dataType = 'table-row';
          newObject.tagName = element.tagName;

          if (bandicootTableToAddTo) {
            bandicootTableToAddTo.push(newObject);
          } else {
            if (!dataName) {
              logAndThrowException(element, 'When table-row is not inside of a table, it must have a data-name');
            }
            bandicootObjectToAddTo[dataName] = newObject;
          }

          bandicootObjectToAddTo = newObject;
          bandicootListToAddTo = bandicootListItemToAddTo = undefined;
        break;

        default:
          logAndThrowException(element, "Unknown data-type '" + dataType + "' in element '" + element.tagName + "'");
      }
    }
  }

  for (var i=0; i<element.childNodes.length; i++) {
    var childNode = element.childNodes[i];
    if (childNode.tagName && childNode.tagName.toUpperCase() === 'SCRIPT') {
      var dataName = childNode.getAttribute('data-name');
      var lists = {};
      var elements = {};
      var objects = {};
      var listToAddTo = listItemToAddTo = tableToAddTo = undefined;

      var domParser = new DOMParser();
      var parsedDom = domParser.parseFromString(childNode.text, "text/html");
      traverseElement(parsedDom, elements, lists, listToAddTo, listItemToAddTo,
        objects, tableToAddTo, buildingBlocks);

      buildingBlocks.push({
        lists: lists,
        elements: elements,
        objects: objects
      });

    } else {
      //not a script tag
      traverseElement(childNode, bandicootElements, bandicootLists,
        bandicootListToAddTo, bandicootListItemToAddTo, bandicootObjectToAddTo, 
        bandicootTableToAddTo, buildingBlocks);   
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
  var domRoot;
  if (location.nodeType) {
    //the location is actually just a dom element
    domRoot = location;
  } else {
    var matchingLocations = document.querySelectorAll('[data-location="' + location + '"]');
    if (matchingLocations.length < 1) {
      throw "Could not find location '" + location + "' in the DOM";
    } else if (matchingLocations.length > 1) {
      throw "Clashing locations: there are two locations named '" + location + "'";
    }

    domRoot = matchingLocations[0];
  }

  var result = {
    dom: {},
    buildingBlocks: {}
  };

  var bandicootLists = {};
  var bandicootElements = {};
  var bandicootObjects = {};
  var bandicootListToAddTo = bandicootListItemToAddTo = bandicootTableToAddTo = undefined;
  var buildingBlocks = [];

  traverseElement(domRoot, bandicootElements, bandicootLists, bandicootListToAddTo, bandicootListItemToAddTo, 
    bandicootObjects, bandicootTableToAddTo, buildingBlocks);

  mergeListsElementsAndObjects(result.dom, bandicootLists, bandicootElements, bandicootObjects);

  for (var i=0; i<buildingBlocks.length; i++) {
    var buildingBlock = buildingBlocks[i];
    mergeListsElementsAndObjects(result.buildingBlocks, buildingBlock.lists, 
        buildingBlock.elements, buildingBlock.objects);
  }

  return result;
};