'use strict';

var gulp = require('gulp'),
    fs = require('fs'),
    fse = require('fs-extra'),
    mapStream = require('map-stream'),
    walkSync = require('walk-sync'),

    plumber = require('gulp-plumber');


var handleErrors = require('./handle-errors');
var config = require('./config');
var log = require('fancy-log');
var util = require('./utils');
var coreConf = require('./project-common');
var path = require('path');
var manifestHelper = require('./manifest-helper');

module.exports = {
    copyByModule: copyByModule,
    copyAssets: copyAssets,
    copyTmpRev: copyTmpRev,
    copyIndex: copyIndex,
    copyChangedRev: copyChangedRev,
    copyChangedDist: copyChangedDist
};


function copyByModule() {

    var filesToCopy = util.normalFilesInModules();
    // log(filesToCopy);
    return gulp.src(filesToCopy, {base: config.webappDir})
        .pipe(plumber({errorHandler: handleErrors.reportError}))
        .pipe(gulp.dest(config.tmp));
}


function copyAssets() {
    var filesToCopy = coreConf.commonAssets.map(function (file) {
        return config.webappDir + file;
    });
    var commonIgnore = coreConf.commonIgnore.map(function (file) {
        return '!' + config.webappDir + file;
    });

    var env = util.getEnv();
    var modules = env.modules;
    var confCommon = require('./project-common');
    var assetsFiles;

    assetsFiles = confCommon.coreCss
        .concat(confCommon.coreJs);

    modules.forEach(function (m) {
        var confModule = require('./project-' + m.name);
        assetsFiles = assetsFiles.concat(confModule.venderJs)
            .concat(confModule.venderCss)
            .concat(confModule.venderAssets || []);
        assetsFiles.push('assets/pages/' + m.name + '/**/*');

    });

    assetsFiles = assetsFiles
        .filter(function (file) {
            return file.startsWith('assets/') || file.startsWith('bower_components/');
        })
        .reduce(function (r, item) {
            //去重
            r[config.webappDir + item] = item;
            return r;
        }, {});

    filesToCopy = filesToCopy
        .concat(Object.keys(assetsFiles))
        .concat(commonIgnore);

    log(filesToCopy);
    return gulp.src(filesToCopy, {base: config.webappDir})
        .pipe(plumber({errorHandler: handleErrors.reportError}))
        .pipe(gulp.dest(config.dist));
}


function copyTmpRev() {
    var f = [config.tmp + 'rev/**/*'];
    return gulp.src(f)
        .pipe(gulp.dest(config.dist + 'app/'));
}

function copyIndex() {
    var f = config.dist + 'index.html';
    log('正在复制 ' + f + ' 到 ', config.webTargetDir);
    var env = util.getEnv();
    return gulp.src(f)
        .pipe(mapStream(function (file, cb) {
            var dFile = file.path.split(path.sep).join('/').replace(config.dist, config.webTargetDir + env.projectName + '-' + env.projectVersion + '/');
            if (fs.existsSync(dFile)) {
                log('删除旧文件', dFile);
                fs.unlinkSync(dFile);
            }
            cb(null, file);
        }))
        .pipe(gulp.dest(config.webTargetDir + env.projectName + '-' + env.projectVersion));
}

function copyChangedRev() {

    var revFiles = manifestHelper.compareManifest();
    log('copy-changed-rev', revFiles);


    revFiles.toDelete.forEach(function (f) {
        log('del', f);
        fse.removeSync(f);
    });
    revFiles.toAdd.forEach(function (f) {
        var n = f.split(path.sep).join('/');
        if (fse.existsSync(f)) {
            log('add', n);
            fse.copySync(f, n.replace(config.tmp + 'rev/', config.dist + 'app/'));
        } else {
            log('skip add', n);
        }
    });

}


function copyChangedDist() {
    var env = util.getEnv();

    var distFiles = walkSync(config.dist, {directories: false, ignore: ['WEB-INF', 'META-INF']});
    var targetPath = config.webTargetDir + env.projectName + '-' + env.projectVersion + '/';
    var targetFiles = walkSync(targetPath, {directories: false, ignore: ['WEB-INF', 'META-INF']});

    distFiles = distFiles.reduce(function (r, file) {
        r[file] = file;
        return r;
    }, {});
    targetFiles = targetFiles.reduce(function (r, file) {
        r[file] = file;
        return r;
    }, {});
    var toAdd = [], toDel = [];
    for (var file in distFiles) {
        if (distFiles[file] !== targetFiles[file]) {
            toAdd.push(file);
            targetFiles[file] && toDel.push(targetFiles[file]);
        }
        delete  distFiles[file];
        delete  targetFiles[file];
    }
    toAdd = toAdd
        .concat(Object.keys(distFiles))
        .map(function (f) {
            return config.dist + f;
        });
    toDel = toDel
        .concat(Object.keys(targetFiles))
        .map(function (f) {
            return targetPath + f;
        });

    toDel.forEach(function (f) {
        if (fse.existsSync(f)) {
            log('del', f);
            fse.removeSync(f);
        } else {
            log('skip del', f);
        }
    });
    toAdd.forEach(function (f) {
        if (fse.existsSync(f)) {
            log('add', f);
            fse.copySync(f, f.replace(config.dist, targetPath));
        } else {
            log('skip add', f);
        }
    });

}
