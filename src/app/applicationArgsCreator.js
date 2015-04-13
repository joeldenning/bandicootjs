module.exports = function(domVariables, eventSourcePath, eventSourceDomElement, KeyboardEvent) {
  var app = require('./index.js');
  var args = app.dependencies.cloneDeep(domVariables);
  args.event = {};
  if (eventSourceDomElement) {
    try {
      args.event.source = app.dependencies.domMapping.getJSElFromPath(domVariables.dom, eventSourcePath);
    } catch(ex) {
      args.event.source = app.dependencies.domMapping.domElToJsEl(eventSourceDomElement);
    }
  }

  if (KeyboardEvent) {
    args.event.keyboard = {
      altKey: KeyboardEvent.altKey,
      ctrlKey: KeyboardEvent.ctrlKey,
      keyCode: KeyboardEvent.keyCode,
      keyIdentifier: KeyboardEvent.keyIdentifier,
      shiftKey: KeyboardEvent.shiftKey
    };
  }

  return args;
}