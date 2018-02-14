'use strict'

var gulp = require('gulp');
var webpack = require('webpack');
var gutil = require('gulp-util');
var inject = require('gulp-inject');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var addsrc = require('gulp-add-src');
const zip = require('gulp-zip');
const map = require('vinyl-map');

/**
 * Creates the tab manifest.
 * Before calling this task 
 * - Launch ngrok (ngrok http 3978)
 * - Get your ngrok redirection (assuming something like https://a719a9eb.ngrok.io)
 * - Launch the task with the ngrok redirection (gulp manifest -hn https://a719a9eb.ngrok.io)
 * In your /package, you will find the correct manifest for your tab application.
 */
gulp.task('manifest', () => {

    // get argument
    let i = process.argv.indexOf("--hostname");
    i = i < 0 ? process.argv.indexOf('-hostname') : i;
    i = i < 0 ? process.argv.indexOf('--hn') : i;
    i = i < 0 ? process.argv.indexOf('-hn') : i;
    i = i < 0 ? process.argv.indexOf('--url') : i;
    i = i < 0 ? process.argv.indexOf('-url') : i;

    let hostName = (i > -1) ? process.argv[i + 1] : 'https://localhost';

    if (i < 0)
        return;

    const modify = (url) => {
        return map((contents, filename) => {
            contents = contents.toString();
            contents = contents.replace(new RegExp('{{HTTPS_URL}}', 'g'), url);

            var urlWithoutHttp = url.replace(new RegExp('https://', 'g'), '');
            urlWithoutHttp = urlWithoutHttp.replace(new RegExp('http://', 'g'), '');

            contents = contents.replace(new RegExp('{{_URL}}', 'g'), urlWithoutHttp);

            return contents;
        });
    }
    gulp.src(['./package/manifest.template.json'])
        .pipe(modify(hostName))
        .pipe(rename("manifest.json"))
        .pipe(addsrc("./package/**/*.png"))
        .pipe(zip('manifest.zip'))
        .pipe(gulp.dest('./package'))


});
