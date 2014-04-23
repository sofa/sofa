var gulp = require('gulp');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
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
    gulp.src(['docs/app/assets/**/*']).pipe(gulp.dest(outputFolder)),
    copyComponent('bootstrap', '/dist/**/*'),
    copyComponent('angular'),
    copyComponent('angular-route'),
    copyComponent('angular-cookies'),
    copyComponent('lunr.js')
  );
});

gulp.task('doc-gen', function() {
  return dgeni.generator('dgeni.conf.js')()
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

gulp.task('watch', function () {
    gulp.watch('docs/app/**/*.js', ['build-app']);
    gulp.watch('docs/app/assets/**/*', ['assets']);
    gulp.watch('docs/content/**/*.sofadoc', ['doc-gen']);
    gulp.watch('docs/config/templates/*', ['doc-gen']);
    gulp.watch('node_modules/dgeni-sofadoc/templates/**/*', ['doc-gen']);
});
