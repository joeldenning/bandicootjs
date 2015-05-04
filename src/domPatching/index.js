module.exports.build = function() {
  return {
    calculateDesiredDomState: require('./calculateDesiredDomState.js'),
    patchDom: require('./patch.js'),
    jsToDom: require('./jsToDom.js')
  }
}