#!/usr/bin/env node

var csso = require('gulp-csso');
var filter = require('gulp-filter');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var minifyHtml = require('gulp-minify-html');
var path = require('path');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');

var sources = [
  'frontend/index.html',
  'frontend/index.css',
  'frontend/bundle.js',
  'frontend/loader.svg',
  'frontend/mark-github.svg',
  'frontend/boomerang.min.js',
  'frontend/boomerang/images/*'
];

var assetsFilter = filter([
  '**/*',
  // do not rev $md5 theses files but still copy them
  '!index.html', '!boomerang/images/*'
]);

var indexFilter = filter('index.html');
var userefAssets = useref.assets();

gulp
  .src(sources, {
    base: path.join(__dirname, '..', 'frontend')
  })
  // let's work on the index page to
  // concatenate needed assets
  .pipe(indexFilter)
  // this is how gulp-useref is used, no mistake
  // it finds builds blocks and then concatenate them
  // we could also use https://github.com/klei/gulp-inject
  .pipe(userefAssets)
  .pipe(userefAssets.restore())
  .pipe(useref())
  // now minify the index page
  .pipe(gulpif(/index\.html$/, minifyHtml()))
  .pipe(indexFilter.restore())
  // let's work on assets
  .pipe(assetsFilter)
  .pipe(gulpif(/index\.css$/, csso()))
  // minify them
  .pipe(gulpif(/bundle\.js$/, uglify()))
  // rev them (md5)
  .pipe(rev())
  .pipe(assetsFilter.restore())
  // replace revs everywhere, inside css, js, html
  .pipe(revReplace())
  .pipe(gulp.dest('public'));
