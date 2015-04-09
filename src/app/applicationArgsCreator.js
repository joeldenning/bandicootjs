module.exports = function(domVariables, eventSourcePath, eventSourceDomElement) {
  var app = require('./index.js');
  var args = app.dependencies.cloneDeep(domVariables);
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