module.exports = {
  getFullyQualifiedName: function(scenario) {
    return scenario.location + '/' + scenario.event + '/' + scenario.scenario;
  }
}