var path = require('canonical-path');
var fs = require('fs');

var basePackage = require('./docs/config');

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
        { pattern: 'sofa-*/src/sofa*.js', basePath: path.resolve(__dirname, './node_modules') },
        { pattern: '**/*.sofadoc', basePath: path.resolve(__dirname, 'docs/content') }
    ]);

    config.set('rendering.outputFolder', 'dist/docs');
    config.set('rendering.contentsFolder', 'partials');

    config.merge('deployment', {
        environments: [{
            name: 'default',
            examples: {
                commonFiles: {
                }
            },
            scripts: [
                'components/lunr.js-' + getVersion('lunr.js') + '/lunr.js',
                'components/angular-' + getVersion('angular')+ '/angular.js',
                'components/angular-route-' + getVersion('angular-route')+ '/angular-route.js',
                'components/angular-cookies-' + getVersion('angular-cookies')+ '/angular-cookies.js',
                'js/versions-data.js',
                'js/pages-data.js',
                'js/docs.js'
            ],
            stylesheets: [
                'components/bootstrap-' + getVersion('bootstrap') + '/css/bootstrap.css',
                'css/docs.css'
            ]
        }]
    });

    return config;
};
