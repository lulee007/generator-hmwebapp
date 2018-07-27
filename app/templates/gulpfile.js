'use strict';
var gulp = require('gulp');

var tool = require('hm-gismap-gulp'),
    config = require('./gulp/config');
// 一定要添加配置文件
tool.configWrap.config = config;

gulp.task('build', tool.build);

gulp.task('default', ['build'], tool.watch);