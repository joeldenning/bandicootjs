module.exports = {
  getFullyQualifiedName: function(domEvent) {
    return domEvent.location + '/' + domEvent.event + '/' + domEvent.outcome;
  }
}