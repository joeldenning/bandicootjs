module.exports = function(obj) {
  for (var prop in obj) {
    if (typeof obj[prop] === 'function') {
      delete obj[prop];
    } else if (typeof obj === 'object') {
      module.exports(obj[prop]);
    }
  }
}