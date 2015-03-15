module.exports = function(events, eventName, slashNamespacing) {
  var event = slashNamespacing.getValueFromNamespacedObject(events, eventName);
  if (!event) {
    throw "No such event " + eventName + " in bandicoot.events.Events object. Event names are of namespaced with slash (/) characters."; 
  }

  
};