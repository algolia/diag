#!/usr/bin/env node

var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');

gulp.src('./public/**/*').pipe(ghPages());
