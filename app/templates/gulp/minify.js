"use strict";

var
    gulp = require('gulp'),
    gulpIf = require('gulp-if'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    lazypipe = require('lazypipe'),
    mapStream = require('map-stream'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    htmlmin = require('gulp-htmlmin'),
    rev = require('gulp-rev'),
    log = require('fancy-log'),
    fs = require('fs'),
    revReplace = require("gulp-rev-replace"),

    manifestHelper = require('./manifest-helper'),
    handleErrors = require('./handle-errors');


var config = require('./config');
var path = require('path');


var jsTask = lazypipe()
    .pipe(uglify, {
        mangle: false,               // 是否修改变量名，默认为 true
        compress: true             // 是否完全压缩，默认为 true
        // preserveComments: 'all'     // 保留所有注释
    });

var cssTask = lazypipe()
    .pipe(cleanCSS);


function revModules() {
    var revFiles = [
        config.tmp + 'app/**/*.*',
        '!' + config.tmp + 'app/**/*.component.js',
        '!' + config.tmp + 'app/app.all.state.js'
        // config.tmp + 'app/**/*.html',
        // config.tmp + 'app/**/*.txt'
    ];

    return gulp.src(revFiles)
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(sourcemaps.init())
        .pipe(gulpIf('*.js', jsTask()))
        .pipe(gulpIf('*.css', cssTask()))
        .pipe(gulpIf('*.html', htmlmin({collapseWhitespace: true})))
        .pipe(gulpIf('**/*.!(txt)', rev()))
        .pipe(gulpIf('**/*.!(txt|html)', sourcemaps.write('.')))
        .pipe(gulp.dest(config.tmp + 'rev/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(config.revDest));

}

function revState() {
    var revFiles = [
        config.tmp + 'app/app.all.state.js'
        // config.tmp + 'app/**/*.css',
        // config.tmp + 'app/**/*.js',
        // config.tmp + 'app/**/*.html',
        // config.tmp + 'app/**/*.txt'
    ];
    var manifest = gulp.src(config.revManifest);

    return gulp.src(revFiles)
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(sourcemaps.init())
        .pipe(revReplace({manifest: manifest}))
        .pipe(jsTask())
        .pipe(rev())
        .pipe(sourcemaps.write('.'))
        .pipe(mapStream(function (file, cb) {
            if (file.path.endsWith('.js')) {
                manifestHelper.saveRev('app.all.state.js', file.path);
            }
            cb(null, file);
        }))
        .pipe(gulp.dest(config.tmp + 'rev/'));
}

function revComponent() {
    var revFiles = [
        config.tmp + 'app/**/*.component.js'
        // config.tmp + 'app/**/*.css',
        // config.tmp + 'app/**/*.js',
        // config.tmp + 'app/**/*.html',
        // config.tmp + 'app/**/*.txt'
    ];
    var manifest = gulp.src(config.revManifest);

    return gulp.src(revFiles)
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(sourcemaps.init())
        .pipe(revReplace({manifest: manifest}))
        .pipe(jsTask())
        .pipe(rev())
        .pipe(sourcemaps.write('.'))
        .pipe(mapStream(function (file, cb) {
            if (file.path.endsWith('.js')) {
                manifestHelper.saveRev(file.path);
            }
            cb(null, file);
        }))
        .pipe(gulp.dest(config.tmp + 'rev/'));
}


function revReplaceIndex() {
    var manifest = gulp.src(config.revManifest);
    return gulp.src(config.tmp + '*.html')
        .pipe(revReplace({manifest: manifest}))
        .pipe(mapStream(function (file, cb) {
            var dFile = file.path.split(path.sep).join('/').replace(config.tmp, config.dist);
            log('revReplaceIndex', dFile);
            if (fs.existsSync(dFile)) {
                log('删除旧文件', dFile);
                fs.unlinkSync(dFile);
            }
            cb(null, file);
        }))
        .pipe(gulp.dest(config.dist));
}

function revReplaceHtml() {
    //TODO ng-include-html 容易导致 rev 不变问题
    var manifest = gulp.src(config.revManifest);
    return gulp.src(config.tmp + 'rev/**/*.html', {base: config.tmp + 'rev/'})
        .pipe(revReplace({manifest: manifest}))
        .pipe(mapStream(function (file, cb) {
            var dFile = file.path.split(path.sep).join('/').replace(config.tmp + 'rev/', config.dist + 'app/');
            log('revReplaceHtml', dFile);
            if (fs.existsSync(dFile)) {
                log('删除旧文件', dFile);
                fs.unlinkSync(dFile);
            }
            cb(null, file);
        }))
        .pipe(gulp.dest(config.dist + 'app/'));
}


module.exports = {
    revModules: revModules,
    revState: revState,
    revComponent: revComponent,
    revReplaceIndex: revReplaceIndex,
    revReplaceHtml: revReplaceHtml,
    jsTask: jsTask
};
