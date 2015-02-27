var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var fs = require('fs');
var mocha = require('gulp-mocha');
var clean = require('gulp-clean');
var watchify = require('watchify');
var gutil = require('gulp-util');

var mochaOpts = {
  reporter: 'spec'
};

gulp.task('b', ['browserify'])
gulp.task('t', ['test']);
gulp.task('ut', ['unit-test']);
gulp.task('it', ['integration-test']);
gulp.task('bt', ['browser-test']);
gulp.task('test', ['mocha-all']);
gulp.task('unit-test', ['mocha-unit']);
gulp.task('integration-test', ['mocha-integration']);
gulp.task('browser-test', ['browserify', 'mocha-browser']);

gulp.task('clean-build', function(done) {
  return gulp
    .src('./dist/bandicoot.js', { read: false })
    .pipe(clean());
});

gulp.task('browserify', ['clean-build', 'run-browserify'])

gulp.task('run-browserify', function(done) {
  var browserifyOpts = {
    entries: ['./src/browser-entry-point.js'],
    debug: true
  };
  return browserify(browserifyOpts)
    .bundle()
    .on('error', console.error)
    .pipe(source('bandicoot.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('mocha-unit', function() {
  return gulp
    .src('./test/unit/**/*.js', { read: false })
    .pipe(mocha(mochaOpts));
});

gulp.task('mocha-integration', function() {
  return gulp
    .src('./test/integration/**/*.js', { read: false })
    .pipe(mocha(mochaOpts));
});

gulp.task('mocha-browser', function() {
  return gulp
    .src('./test/browser/**/*.js', { read: false })
    .pipe(mocha(mochaOpts));
});

gulp.task('mocha-all', ['browserify', 'mocha-run-all']);

gulp.task('mocha-run-all', function() {
  return gulp
    .src('./test/**/*.js', { read: false })
    .pipe(mocha(mochaOpts));
})