'use strict';
/* eslint-disable angular/timeout-service */
var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    gulp_watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    Q = require('q'),
    gulpIf = require('gulp-if'),
    path = require('path'),
    clean = require('gulp-clean');
var log = require('fancy-log');

var hmWatch = require('./gulp/watch');
var fse = require('fs-extra');
var handleErrors = require('./gulp/handle-errors'),
    util = require('./gulp/utils'),
    copy = require('./gulp/copy'),
    inject = require('./gulp/inject'),
    buildStyle = require('./gulp/build-style'),
    merge = require('./gulp/merge'),
    minify = require('./gulp/minify'),
    manifestHelper = require('./gulp/manifest-helper'),
    config = require('./gulp/config');

gulp.task('inject-index', inject.index);
gulp.task('inject-states', inject.states);
gulp.task('inject-home', inject.homeModule);

gulp.task('build-styles', buildStyle.buildStylesByFolders);

gulp.task('merge-css', merge.mergeCssByModule);
gulp.task('merge-component', merge.mergeComponentsByModule);
gulp.task('merge-service', merge.mergeServicesByModule);
gulp.task('merge-state', merge.mergeAllStates);

gulp.task('copy-modules', copy.copyByModule);
gulp.task('copy-assets', copy.copyAssets);
gulp.task('copy-tmp-rev', copy.copyTmpRev);
gulp.task('copy-index', copy.copyIndex);
gulp.task('copy-changed-rev', copy.copyChangedRev);
gulp.task('copy-changed-dist', copy.copyChangedDist);

gulp.task('rev-modules', minify.revModules);
gulp.task('rev-components', minify.revComponent);
gulp.task('rev-states', minify.revState);
gulp.task('rev-replace-index', minify.revReplaceIndex);
gulp.task('rev-replace-html', minify.revReplaceHtml);

gulp.task('clean-dist', function () {
    return gulp.src(config.dist, {read: false})
        .pipe(plumber({errorHandler: handleErrors.reportError}))
        .pipe(clean());
});
gulp.task('clean-temp', function () {
    return gulp.src([config.tmp], {read: false})
        .pipe(plumber({errorHandler: handleErrors.reportError}))
        .pipe(clean());
});
gulp.task('clean-temp-css', function () {
    var env = util.getEnv();
    var tmpCss = [];
    env.modules.forEach(function (m) {
        tmpCss.push(m.tmpPath + '/**/*.css');
        tmpCss.push('!' + m.tmpPath + '/**/*.all.css');

    });
    log('css to clean', tmpCss);
    return gulp.src(tmpCss)
        .pipe(plumber({errorHandler: handleErrors.reportError}))
        .pipe(clean());
});
gulp.task('clean-temp-state', function () {
    var tmpStates = [config.tmp + '**/*.state.js', '!' + config.tmp + 'app/app.all.state.js'];
    log('state to clean', tmpStates);
    return gulp.src(tmpStates)
        .pipe(plumber({errorHandler: handleErrors.reportError}))
        .pipe(clean());
});
gulp.task('clean-temp-rev', function () {
    return gulp.src([config.tmp + 'rev'], {read: false})
        .pipe(plumber({errorHandler: handleErrors.reportError}))
        .pipe(clean());
});
gulp.task('clean-dist-app', function () {
    return gulp.src([config.dist + 'app'], {read: false})
        .pipe(plumber({errorHandler: handleErrors.reportError}))
        .pipe(clean());
});


gulp.task('watch-assets-vender', hmWatch.assets_vender);
gulp.task('watch-dist', hmWatch.dist);
gulp.task('watch-module', hmWatch.module);
gulp.task('watch-normalJsHtml', hmWatch.normalJsHtml);
var watch_dev_building = false;
gulp.task('watch-dev', function () {
    var changedCount = 0;
    var lastLoopTime;
    var lastWatchLoop;
    var watchTime = 1500;
    return gulp_watch(config.tmp + 'app/**/*', function (f) {
        changedCount++;
        log('changedCount', changedCount, watch_dev_building, f.path);
        if (watch_dev_building) {
            return;
        }
        if (!lastLoopTime || new Date().getTime() - lastLoopTime > watchTime) {
            log('开始 watch loop');
            lastWatchLoop = runWatchLoop();
        } else {
            if (lastWatchLoop) {
                log('清除上次计划', watchTime - (new Date().getTime() - lastLoopTime));
                clearTimeout(lastWatchLoop);
                lastWatchLoop = runWatchLoop();
            }
        }
    });

    function runWatchLoop() {
        lastLoopTime = new Date();
        return setTimeout(function () {
            if (changedCount > 0) {
                log('执行 build-dev');
                changedCount = 0;
                gulp.start('build-dev');
                watch_dev_building = true;
            }
        }, watchTime);
    }
});

gulp.task('build-dev-done', function (cb) {
    watch_dev_building = false;
    cb && cb();
});


gulp.task('save-old-manifest', manifestHelper.saveOldManifest);
/**
 * 完整构建：
 * 1.  清空原先 dist 和tmp 目录
 * 2.  复制项目commonAssets
 * 3.  编译样式文件 到tmp目录
 * 4   合并 组件，样式
 * 5   清除 临时 样式文件
 */
gulp.task('build', function (cb) {
    runSequence(
        'clean-dist',
        'clean-temp',
        'copy-assets',

        'build-styles',
        'merge-css',
        'clean-temp-css',

        'merge-component',

        'merge-service',

        'copy-modules',

        'inject-states',
        'inject-index',
        'inject-home',

        'merge-state',
        'clean-temp-state',

        'rev-modules',
        'rev-components',
        'rev-states',
        'rev-replace-index',
        'copy-tmp-rev',
        'rev-replace-html',
        cb);
});

gulp.task('build-dev', function (cb) {
    log('开始重新构建');
    runSequence(
        'save-old-manifest',
        'clean-temp-rev',
        'inject-states',
        'inject-index',
        'inject-home',
        'merge-state',
        'clean-temp-state',
        'rev-modules',
        'rev-components',
        'rev-states',
        'rev-replace-index',
        'copy-changed-rev',
        'rev-replace-html',
        'build-dev-done',
        cb);
});

gulp.task('reload-browser', function () {
    // setTimeout(function () {
    //     log('这里刷新一下浏览器~~');
    //     browserSync.reload();
    // }, 2000);
});

gulp.task('start-browser-sync', function () {

    var env = util.getEnv();
    var port = env.port;
    config.proxyUrl = 'http://localhost:' + port + '/sims-gis-map-frontend/';
    config.projectName = 'sims-gis-map-frontend';
    browserSync({
        port: config.port,
        proxy: config.proxyUrl
    });
});

gulp.task('temp', function (cb) {
    // var argv = process.argv;
    // if (!argv || !argv[3]) {
    //     console.error('用法：gulp buildProject --tongli_wechat \r\n如：gulp --PROJECT_NAME');
    //     return;
    // }
    // runSequence('clean-dist', 'inject:index', 'copy:project', cb);
    // runSequence(['watch-module', 'watch-assets-vender', 'watch-normalJsHtml', 'watch-dist'], cb);
    // return runSequence('build', ['watch-module', 'watch-assets-vender', 'watch-normalJsHtml', 'watch-dist', 'watch-dev'], cb);

});

gulp.task('default', function (cb) {
    var argv = process.argv;
    if (!argv || !argv[2]) {
        console.error('用法：gulp --port \r\n如：gulp --8080');
        return;
    }
    // TODO  'copy-index', 之后需要 对比 target 与dist 目录，更新到target
    runSequence('build', 'copy-index', 'copy-changed-dist', ['watch-module', 'watch-assets-vender', 'watch-normalJsHtml', 'watch-dist', 'watch-dev', 'start-browser-sync'], cb);
});

// TODO files to delete
// app home 需要添加到白名单中
// src/main/webapp/app.all.state.js
// src/main/webapp/**/*.merged.state.js
// **/*.css

