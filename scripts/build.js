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
var debug = require('gulp-debug');

var sources = [
  'frontend/index.html',
  'frontend/index.css',
  'frontend/bundle.js',
  'frontend/loader.svg',
  'frontend/mark-github.svg',
  'frontend/algolia-logo.svg',
  'frontend/boomerang.min.js',
  'frontend/boomerang/images/*'
];

var assetsFilter = filter([
  '**',
  // do not rev $md5 theses files but still copy them
  '!**/index.html', '!**/boomerang/images/*'
], {restore: true});

var indexFilter = filter('index.html', {restore: true});

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
  .pipe(useref())
  // now minify the index page
  .pipe(gulpif(/index\.html$/, minifyHtml()))
  .pipe(indexFilter.restore)
  // let's work on assets
  .pipe(assetsFilter)
  .pipe(gulpif(/index\.css$/, csso()))
  // minify them
  .pipe(gulpif(/bundle\.js$/, uglify()))
  .pipe(debug({title: 'coucou'}))
  // rev them (md5)
  .pipe(rev())
  .pipe(assetsFilter.restore)
  // replace revs everywhere, inside css, js, html
  .pipe(revReplace())
  .pipe(gulp.dest('public'));
