module.exports = {
  getFullyQualifiedName: function(domEvent) {
    return domEvent.location + '/' + domEvent.what + '/' + domEvent.outcome;
  }
}