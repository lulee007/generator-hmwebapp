'use strict';
var process = require('process');
var cwd = process.cwd();

module.exports = {
    version: '1.0.0',
    dist: 'src/main/dist/',
    webappDir: 'src/main/webapp/',
    revDest: 'src/main/tmp/',
    bower: 'src/main/webapp/bower_components/',
    tmp: 'src/main/tmp/',
    revManifest: 'src/main/tmp/rev-manifest.json',
    webTargetDir: 'target/',
    port: 9000,
    gulpDir: cwd + '/gulp/',
    projectName : '<%= projectName %>'
};
