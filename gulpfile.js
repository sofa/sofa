var gulp = require('gulp');
var concat = require('gulp-concat');
var dgeni = require('dgeni');
var merge = require('event-stream').merge;
var path = require('canonical-path');

var outputFolder = 'dist/docs';
var bowerFolder = 'bower_components';

var copyComponent = function(component, pattern, sourceFolder, packageFile) {
  pattern = pattern || '/**/*';
  sourceFolder = sourceFolder || bowerFolder;
  packageFile = packageFile || 'bower.json';
  var version = require(path.resolve(sourceFolder,component,packageFile)).version;
  return gulp
    .src(sourceFolder + '/' + component + pattern)
    .pipe(gulp.dest(outputFolder + '/components/' + component + '-' + version));
};

gulp.task('assets', function() {
  return merge(
    gulp.src(['app/assets/**/*']).pipe(gulp.dest(outputFolder)),
    copyComponent('angular'),
    copyComponent('angular-route'),
    copyComponent('angular-cookies')
  );
});

gulp.task('doc-gen', function() {
  return dgeni('dgeni.conf.js')
    .generateDocs()
    .catch(function(error) {
      process.exit(1);
    });
});

gulp.task('build-app', function () {
  gulp.src('docs/app/src/**/*.js')
    .pipe(concat('docs.js'))
    .pipe(gulp.dest(outputFolder + '/js/'));
});

gulp.task('default', ['assets', 'doc-gen', 'build-app']);
