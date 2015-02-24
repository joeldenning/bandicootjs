var fs = require('fs');

module.exports.build = function(isProductionEnvironment) {
  var exportedModulesDirPath = __dirname + '/exportedModules/';
  
  var bandicoot = {
    library: {}
  }
  
  fs.readdirSync(exportedModulesDirPath).forEach(function(moduleFilename) {
    var moduleName = moduleFilename.substr(0, moduleFilename.indexOf('.js'));
    bandicoot.library[moduleName] = require(exportedModulesDirPath + moduleFilename).build(isProductionEnvironment)
  })
    
  return bandicoot;
}