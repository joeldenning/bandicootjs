module.exports.build = function() {
  var framework = {};
  var app = {};
  var bandicoot = {
    app: app,
    framework: framework
  };

  function injectDependencies(targetObject, depNames) {
    targetObject.dependencies = [];
    depNames.forEach(function(depName) {
      targetObject.dependencies[depName] = framework[depName];
    });
  }

  function buildModule(moduleName, unbuiltModule, moduleDependencies) {
    injectDependencies(unbuiltModule, moduleDependencies);
    framework[moduleName] = unbuiltModule.build();    
  }

  //build modules
  framework.lodash = require('lodash');
  framework.deepDiff = require('deep-diff');
  framework.keycode = require('keycode');
  buildModule('cloneDeep', require('./cloneDeep/index.js'), ['lodash']);
  buildModule('strictTyping', require('./strictTyping/index.js'), ['lodash']);
  buildModule('slashNamespacing', require('./slashNamespacing/index.js'), ['lodash']);
  buildModule('domEvents', require('./domEvents/index.js'), ['lodash']);
  buildModule('serviceInjector', require('./serviceInjector/index.js'), ['cloneDeep', 'strictTyping']);
  buildModule('domElements', require('./domElements/index.js'), ['strictTyping', 'lodash']);
  buildModule('domMapping', require('./domMapping/index.js'), ['lodash', 'strictTyping', 'domElements', 'cloneDeep']);
  buildModule('domPatching', require('./domPatching/index.js'), ['lodash', 'deepDiff', 'cloneDeep', 'domMapping', 'cloneDeep']);

  //now build the app
  var unbuiltApp = require('./app/index.js');
  injectDependencies(unbuiltApp, ['cloneDeep', 'domElements', 'domEvents', 'domMapping', 
    'domPatching', 'slashNamespacing', 'strictTyping', 'lodash', 'serviceInjector']);
  var builtApp = unbuiltApp.build();

  framework.lodash.assign(bandicoot, builtApp);

  return bandicoot;
}