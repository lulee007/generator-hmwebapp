'use strict';
var process = require('process');
var cwd = process.cwd();

var _API_KEY = 'zxxxxxxxxxxxx';

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
    projectName : '<%= projectName %>',
    APPCONSTANTS: {
        API_KEY: _API_KEY,
        API_HOST: 'gateway/simsgismap/api/',
        AUTH_URL: 'gateway/api/authenticate',
        ASSETS: {
            LOADING: 'assets/global/img/loading.gif'
        },
        ALL_MODULES: {
            xxxxx: {
                name: "xxxxx",
                href: "#/tp?apikey=" + _API_KEY + "&state=xxxxx",
                src: "assets/global/img/xxxx.png"
            }
        }
    }
};
