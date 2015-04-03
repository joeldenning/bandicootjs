var _ = require('lodash');

module.exports = function(element) {
  var domElements = require('./index.js').dependencies.domElements;

  var jsEl = {
    cloneDeep: function() {
      return _.cloneDeep(jsEl, cloneDeepCustomizer);
    }
  };
  for (var i=0; i<element.attributes.length; i++) {
    switch(element.attributes[i].nodeName) {
      case 'class':
        jsEl.class = element.attributes[i].value.split(/ +/);
      break;
      default:
        jsEl[element.attributes[i].nodeName] = element.attributes[i].value;
      break;
    }
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
    jsEl.class = []
  }

  if (!_.isUndefined(element.checked)) {
    jsEl.checked = element.checked;
  }

  return jsEl;
};