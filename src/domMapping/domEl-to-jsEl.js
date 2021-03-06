var _ = require('./index.js').dependencies.lodash;

module.exports = function(element) {
  var domElements = require('./index.js').dependencies.domElements;
  var transferAttrFromDomElToObj = require('./transferAttrFromDomElToObj.js');

  var jsEl = {
    cloneDeep: require('./index.js').dependencies.cloneDeep.bind(jsEl)
  };
  for (var i=0; i<element.attributes.length; i++) {
    transferAttrFromDomElToObj(element, element.attributes[i].name, jsEl);
  }
  if (element.value) {
    jsEl.value = element.value;
  }
  jsEl.tagName = element.tagName;
  if (domElements[element.tagName]) {
    var defn = domElements[element.tagName];
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

  if (_.isUndefined(jsEl.class)) {
    jsEl.class = [];
  }

  if (_.isUndefined(jsEl.style)) {
    jsEl.style = {};
  }

  if (!_.isUndefined(element.checked)) {
    jsEl.checked = element.checked;
  }

  if (typeof element.textContent === 'string') {
    jsEl.text = require('./parseTextAttribute.js')(element);
  }

  return jsEl;
};