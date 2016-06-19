'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const nodemon = require('gulp-nodemon');
const mocha = require('gulp-mocha');

gulp.task('test', function(){
  return gulp.src(__dirname + '/test/*.js')
    .pipe(mocha());
});

gulp.task('linter', function(){
  return gulp.src(__dirname + '/*.js', !'node_modules/', !'db/')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('nodemon', function(){
  nodemon({
    script: 'server.js',
    ext: 'js',
    ignore: 'node_modules/'
  });
});

gulp.task('default', ['linter', 'test']);
