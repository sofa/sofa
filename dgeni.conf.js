var path = require('canonical-path');
var fs = require('fs');

var basePackage = require('./docs/config');
var sofadocPackage = require('dgeni-sofadoc');

module.exports = function (config) {

    var getVersion = function(component, sourceFolder, packageFile) {
        sourceFolder = sourceFolder || 'bower_components';
        packageFile = packageFile || 'bower.json';
        return JSON.parse(fs.readFileSync(path.join(sourceFolder,component,packageFile), 'utf8')).version;
    };

    config = basePackage(config);

    config.set('logging.level', 'debug');

    config.set('source.projectPath', '.');

    config.set('source.files', [
        {
            pattern: 'sofa-core/src/sofa.js',
            basePath: path.resolve(__dirname, './node_modules')
        },
        {
            pattern: 'sofa-core/src/sofa.*.js',
            basePath: path.resolve(__dirname, './node_modules')
        },
        {
            pattern: 'sofa-logging-service/src/sofa*.js',
            basePath: path.resolve(__dirname, './node_modules')
        },
        {
            pattern: 'sofa-url-parser-service/src/sofa*.js',
            basePath: path.resolve(__dirname, './node_modules')
        },
        {
            pattern: 'sofa-device-service/src/sofa*.js',
            basePath: path.resolve(__dirname, './node_modules')
        },
        {
            pattern: 'sofa-storages/src/sofa*.js',
            basePath: path.resolve(__dirname, './node_modules')
        },
        {
            pattern: 'sofa-basket-service/src/sofa*.js',
            basePath: path.resolve(__dirname, './node_modules')
        }
    ]);

    config.set('rendering.outputFolder', 'dist/docs');
    config.set('rendering.contentsFolder', 'partials');

  config.merge('deployment', {
    environments: [{
      name: 'default',
      scripts: [
        'components/angular-' + getVersion('angular')+ '/angular.js',
        'components/angular-route-' + getVersion('angular-route')+ '/angular-route.js',
        'components/angular-cookies-' + getVersion('angular-cookies')+ '/angular-cookies.js',
        'js/versions-data.js',
        'js/pages-data.js',
        'js/docs.js'
      ],
      stylesheets: []
    }]
  });

    return config;
};
