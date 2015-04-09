module.exports.build = function() {
  return {
    calculateDesiredDomState: require('./calculateDesiredDomState.js'),
    patchDom: require('./patch.js')
  }
}