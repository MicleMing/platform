/**
 * @file gulp
 * @author lanmingming@baidu.com
 * @date 2015-12-22
 */
var del = require('del');
var gulp = require('gulp');
var webpack = require('gulp-webpack-build');
var path = require('path');
var zip = require('gulp-zip');
var fs = require('fs');
var print = require('gulp-print');
var minifyCSS = require('gulp-minify-css');

var src = './src';
var dest = './build';

var WEBPACK_CONFIG_FILENAME = webpack.config.CONFIG_FILENAME;


var args = {};

process.argv.forEach(function (arg, i) {
    if (arg.indexOf('-') === 0) {
        var name = arg.match(/(?:^\-+)(.*)$/)[1];
        if (name) {
            var val = process.argv[i + 1];
            args[name] = (val && val.indexOf('-') !== 0) ? val : '';
        }
    }
});
console.log(args);

// task - clean
gulp.task('clean', function (cb) {
    del.sync(dest);
    cb();
});

// task - build
gulp.task('build', ['clean'], function () {
    // index.html

    fs.readFile(path.join(src, 'index.html'), 'utf8', function (err, content) {
        fs.mkdirSync('build');
        fs.writeFileSync(path.join(dest, 'index.html'), content, 'utf8')
    });
    return gulp.src(WEBPACK_CONFIG_FILENAME)
        .pipe(webpack.init({useMemoryFs: true}))
        .pipe(webpack.run())
        .pipe(webpack.format({
            version: false,
            timings: true
        }))
        .pipe(webpack.failAfter({
            errors: true,
            warnings: true
        }))
        .pipe(gulp.dest('.'));
});

gulp.task('minify', ['build'], function () {
    return gulp.src(path.join(dest, '**.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest(dest));
});
// task - watch
gulp.task('watch', ['build'], function () {
    gulp.src(WEBPACK_CONFIG_FILENAME)
        .pipe(webpack.init({useMemoryFs: true}))
        .pipe(webpack.watch(function (err, stats) {
            gulp.src(this.path, {base: this.base})
                .pipe(webpack.proxy(err, stats))
                .pipe(gulp.dest('.'))
        }));
});

// task - release
gulp.task('release', ['minify'], function () {

    del.sync(release);
    return gulp.src(dest + '/**')
        .pipe(print())
        .pipe(gulp.dest(release));
});
