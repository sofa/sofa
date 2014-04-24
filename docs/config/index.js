var path = require('canonical-path');
var packagePath = __dirname;

var sofadocPackage = require('dgeni-sofadoc');
var examplesPackage = require('dgeni-packages/examples');

module.exports = function (config) {

    config = sofadocPackage(config);
    config = examplesPackage(config);

    config.append('processing.processors', [
        require('./processors/git-data'),
        require('./processors/keywords'),
        require('./processors/versions-data'),
        require('./processors/pages-data'),
        require('./processors/index-page')
    ]);

    config.set('processing.search.ignoreWordsFile', path.resolve(packagePath, 'ignore.words'));
    config.prepend('rendering.templateFolders', [
        path.resolve(packagePath, 'templates')
    ]);

    return config;
};
