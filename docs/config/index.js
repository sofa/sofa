var path = require('canonical-path');
var packagePath = __dirname;

var sofadocPackage = require('dgeni-sofadoc');

module.exports = function (config) {

    config = sofadocPackage(config);

    config.append('processing.processors', [
        require('./processors/git-data'),
        require('./processors/versions-data'),
        require('./processors/pages-data'),
        require('./processors/index-page')
    ]);

    config.prepend('rendering.templateFolders', [
        path.resolve(packagePath, 'templates')
    ]);

    return config;
};
