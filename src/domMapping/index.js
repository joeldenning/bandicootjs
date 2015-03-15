var _ = require('lodash');

module.exports.build = function(strictTyping) {
  var elementDefinitions = {};
  var inputDefinition = require('./elements/input.js');
  strictTyping.validateObjectIsOfType(inputDefinition, 'DomElementDefinition');
  elementDefinitions[inputDefinition.tagName] = inputDefinition;

  return {
    extractToVariables: function(mapping, types) {
      var matchingScopes = document.querySelectorAll('[data-scope="' + mapping.$scope + '"]');
      if (matchingScopes.length > 1) {
        throw 'Scope ' + mapping.$scope + ' exists more than once on the page';
      }

      var lists = {};
      var elements = {};

      function traverseElement(element, listToAddTo, listItemToAddTo) {
        if (_.isFunction(element.getAttribute)) {
          var dataType = element.getAttribute('data-type');
          var dataName = element.getAttribute('data-name');
          if (dataType) {

            if (elements[dataName]) {
              throw "element with name '" + dataName + "' already exists in scope '" + mapping.$scope;
            }

            switch(element.getAttribute('data-type')) {
              case 'element':
                if (!dataName) {
                  throw 'element must have a data-name';
                }

                var jsEl = {};
                for (var i=0; i<element.attributes.length; i++) {
                  if (element.attributes[i].nodeName.indexOf('data-') !== 0) {
                    jsEl[element.attributes[i].nodeName] = element.attributes[i].value;
                  }
                }
                if (elementDefinitions[element.tagName]) {
                  Object.keys(elementDefinitions[element.tagName].defaultAttributeValues).forEach(function(attributeName) {
                    if (_.isUndefined(jsEl[attributeName])) {
                      var defaultValue = elementDefinitions[element.tagName].defaultAttributeValues[attributeName];
                      switch (typeof defaultValue) {
                        case 'string':
                          jsEl[attributeName] = defaultValue;
                        break;
                        case 'function':
                          jsEl[attributeName] = defaultValue(element);
                        break;
                      }
                    }
                  });
                }

                if (listItemToAddTo) {
                  if (listItemToAddTo[dataName]) {
                    throw "element named '" + dataName + "' already exists in list '" + listToAddTo + "'";
                  }

                  listItemToAddTo[dataName] = jsEl;
                } else if (elements[dataName]) {
                  throw "element named '" + dataName + "' already exists";
                } else {
                  elements[dataName] = jsEl;
                }
              break;
              case 'list':
                if (!dataName) {
                  throw 'list must have a data-name';
                }

                listToAddTo = [];
                listItemToAddTo = undefined;

                if (lists[dataName]) {
                  throw "list named '" + dataName + "' already exists";
                }

                lists[dataName] = listToAddTo;
              break;
              case 'list-item':
                if (_.isUndefined(listToAddTo)) {
                  throw "Cannot add list-item '" + dataName + "' because there is no list to add to";
                }

                if (listItemToAddTo) {
                  throw "Cannot add a list item to a list item";
                }

                listItemToAddTo = {};
                listToAddTo.push(listItemToAddTo);
            }
          }
        }

        for (var i=0; i<element.childNodes.length; i++) {
          traverseElement(element.childNodes[i], listToAddTo, listItemToAddTo);
        }
      };

      var scope = matchingScopes[0];
      traverseElement(scope);

      var result = {};
      Object.keys(lists).forEach(function(listName) {
        result[listName] = lists[listName];
      });
      Object.keys(elements).forEach(function(elementName) {
        if (result[elementName]) {
          throw "Cannot have both a list and an element named '" + elementName + "'";
        }

        result[elementName] = elements[elementName];
      });
      return result;
    }
  };
};