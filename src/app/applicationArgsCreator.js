var _ = require('lodash');

module.exports = function(domVariables, eventSourcePath, eventSourceDomElement) {
  var app = require('./index.js');

  var args = _.cloneDeep(domVariables, app.dependencies.cloneDeep.lodashCustomizer);
  if (eventSourceDomElement) {
    args.event = {};
    try {
      args.event.source = app.dependencies.domMapping.getJSElFromPath(domVariables.dom, eventSourcePath);
    } catch(ex) {
      args.event.source = app.dependencies.domMapping.domElToJsEl(eventSourceDomElement);
    }
  }
  return args;
}