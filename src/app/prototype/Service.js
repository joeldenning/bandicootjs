module.exports = {
  getFullyQualifiedName: function(service) {
    return service.owner + '/' + service.service;
  }
}