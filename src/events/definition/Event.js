module.exports = {
  getFullyQualifiedName: function(domEvent) {
    return domEvent.where + '/' + domEvent.action;
  }
};