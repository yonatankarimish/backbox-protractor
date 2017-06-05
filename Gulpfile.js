/**
 * Created by Yonatan on 30/05/2017.
 */
var gulp = require('gulp');
var inject = require('gulp-inject');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var protractor = require('gulp-protractor').protractor;

gulp.task('test', ['build-html'], function(){

});

gulp.task('build-html', ['build-images'], function(){
    var cacheBuster = Math.random();

    return gulp.src('./assets/pre-index.html')
        .pipe(rename('index.html'))
        .pipe(replace('.css"', '.css?cb='+cacheBuster+'"'))
        .pipe(replace('.js"', '.js?cb='+cacheBuster+'"'))
        .pipe(gulp.dest('.'))
        ;
});

gulp.task('build-images', ['run-protractor'], function(){
// It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(['./screenshots/**/*.png'], {read: false});
    var params = {
        starttag: 'var images = [',
        endtag: '];',
        transform: function (filepath, file, i, length) {
            return '"' + filepath.slice(1) + '", ';
        }
    };

    return gulp.src('./assets/pre-images.js')
        .pipe(rename('images.js'))
        .pipe(inject(sources, params))
        .pipe(gulp.dest('./assets/'))
        ;
});

gulp.task('run-protractor', function(){
    return gulp.src(['./specs/*.js']) //collects all protractor specs from the specified folder
        .pipe(protractor({
            configFile: "protractor-conf.js",
            args: [
                '--baseUrl', 'https://',
                //'--suite', 'settings',
                '--params.environment', 'test'
            ]
        }))
        .on('error', function(e){
            console.log('gulp-protractor has encountered an error: ', e);
            throw e;
        })
    ;
});