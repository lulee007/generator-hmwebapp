// 使用 <%= name %> <%= version %> 生成于 <%= date %> 
'use strict';

var gulp = require('gulp-param')(require('gulp'), process.argv),
    rev = require('gulp-rev'),
    templateCache = require('gulp-angular-templatecache'),
    htmlmin = require('gulp-htmlmin'),
    minifyCss = require("gulp-minify-css"),
    ngConstant = require('gulp-ng-constant'),
    rename = require('gulp-rename'),
    eslint = require('gulp-eslint'),
    del = require('del'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    plumber = require('gulp-plumber'),
    changed = require('gulp-changed'),
    gulpIf = require('gulp-if'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat');


var handleErrors = require('./gulp/handle-errors'),
    serve = require('./gulp/serve'),
    util = require('./gulp/utils'),
    copy = require('./gulp/copy'),
    inject = require('./gulp/inject'),
    build = require('./gulp/build');

var config = require('./gulp/config');

gulp.task('clean', function () {
    return del([config.dist], {dot: true});
});

gulp.task('copy', ['copy:fonts', 'copy:common']);

gulp.task('copy:fonts', copy.fonts);

gulp.task('copy:common', copy.common);

gulp.task('copy:swagger', copy.swagger);

gulp.task('copy:images', copy.images);



gulp.task('styles', [], function () {
    return gulp.src(config.app + 'content/css')
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('inject', function () {
    runSequence('inject:dep', 'inject:app');
});

gulp.task('inject:dep', ['inject:test', 'inject:vendor']);

gulp.task('inject:app', inject.app);

gulp.task('inject:vendor', inject.vendor);

gulp.task('inject:test', inject.test);

gulp.task('inject:troubleshoot', inject.troubleshoot);

gulp.task('assets:prod', ['images', 'styles', 'html', 'copy:swagger', 'copy:images'], build);

gulp.task('html', function () {
    return gulp.src(config.app + 'app/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(templateCache({
            module: 'BigDataBackendApp',
            root: 'app/',
            moduleSystem: 'IIFE'
        }))
        .pipe(gulp.dest(config.tmp));
});

// check app for eslint errors
gulp.task('eslint', function () {
    return gulp.src(['gulpfile.js', config.app + 'app/**/*.js'])
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

// check app for eslint errors anf fix some of them
gulp.task('eslint:fix', function () {
    return gulp.src(config.app + 'app/**/*.js')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(eslint({
            fix: true
        }))
        .pipe(eslint.format())
        .pipe(gulpIf(util.isLintFixed, gulp.dest(config.app + 'app')));
});


gulp.task('watch', function () {
    gulp.watch('bower.json', ['install']);
    gulp.watch(['gulpfile.js', 'pom.xml'], ['ngconstant:dev']);
    gulp.watch(config.app + 'content/css/**/*.css', ['styles']);
    gulp.watch(config.app + 'content/images/**', ['images']);
    gulp.watch(config.app + 'app/**/*.js', ['inject:app']);
    gulp.watch([config.app + '*.html', config.app + 'app/**', config.app + 'i18n/**']).on('change', browserSync.reload);
});

gulp.task('build', ['clean'], function (cb) {
    runSequence(['copy', 'inject:vendor', 'ngconstant:prod'], 'inject:app', 'inject:troubleshoot', 'assets:prod', cb);
});

// add by xhlu
/**
 * 压缩指定的 css 文件
 **/
gulp.task('min:css', function (file) {
    var folder = file.substring(0, file.lastIndexOf("/"));
    return gulp.src([file]).pipe(rename({suffix: '.min'})).pipe(minifyCss()).pipe(gulp.dest(folder));

});

/**
 * 将所有state文件合并到 all.other.state.js 文件当中
 **/
gulp.task('build:routers', function () {
    var targetJs = 'app.other.state.js';
    return gulp.src(config.app + '/app/' + targetJs)
        .pipe(clean())
        .on('error', function () {
            console.log('删除文件失败：' + targetJs);
        })
        .on('end', function () {
            console.log('删除原 ' + targetJs);
            return gulp.src([config.app + 'app/**/!(app)*.state.js'])
                .pipe(concat(targetJs))
                .pipe(gulp.dest(config.app + '/app/'));
        });
});

gulp.task('watch:routers', function () {
    gulp.watch(config.app + 'app/**/!(app)*.state.js', ['build:routers']);
});

gulp.task('browser-sync', function () {

    browserSync({
        open: true,
        port: config.port,
        server: {
            baseDir: config.app
        }
    });
    gulp.watch([config.app + '*.html', config.app + 'app/**']).on('change', browserSync.reload);

});

gulp.task('default', function () {
    runSequence(['build:routers', 'watch:routers', 'browser-sync']);
});
